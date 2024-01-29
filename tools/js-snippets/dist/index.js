var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod2) => function __require() {
  return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from3, except, desc) => {
  if (from3 && typeof from3 === "object" || typeof from3 === "function") {
    for (let key of __getOwnPropNames(from3))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from3[key], enumerable: !(desc = __getOwnPropDesc(from3, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));

// node_modules/pvtsutils/build/index.js
var require_build = __commonJS({
  "node_modules/pvtsutils/build/index.js"(exports) {
    "use strict";
    var ARRAY_BUFFER_NAME = "[object ArrayBuffer]";
    var BufferSourceConverter = class _BufferSourceConverter {
      static isArrayBuffer(data) {
        return Object.prototype.toString.call(data) === ARRAY_BUFFER_NAME;
      }
      static toArrayBuffer(data) {
        if (this.isArrayBuffer(data)) {
          return data;
        }
        if (data.byteLength === data.buffer.byteLength) {
          return data.buffer;
        }
        if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
          return data.buffer;
        }
        return this.toUint8Array(data.buffer).slice(data.byteOffset, data.byteOffset + data.byteLength).buffer;
      }
      static toUint8Array(data) {
        return this.toView(data, Uint8Array);
      }
      static toView(data, type) {
        if (data.constructor === type) {
          return data;
        }
        if (this.isArrayBuffer(data)) {
          return new type(data);
        }
        if (this.isArrayBufferView(data)) {
          return new type(data.buffer, data.byteOffset, data.byteLength);
        }
        throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
      }
      static isBufferSource(data) {
        return this.isArrayBufferView(data) || this.isArrayBuffer(data);
      }
      static isArrayBufferView(data) {
        return ArrayBuffer.isView(data) || data && this.isArrayBuffer(data.buffer);
      }
      static isEqual(a, b) {
        const aView = _BufferSourceConverter.toUint8Array(a);
        const bView = _BufferSourceConverter.toUint8Array(b);
        if (aView.length !== bView.byteLength) {
          return false;
        }
        for (let i = 0; i < aView.length; i++) {
          if (aView[i] !== bView[i]) {
            return false;
          }
        }
        return true;
      }
      static concat(...args) {
        let buffers;
        if (Array.isArray(args[0]) && !(args[1] instanceof Function)) {
          buffers = args[0];
        } else if (Array.isArray(args[0]) && args[1] instanceof Function) {
          buffers = args[0];
        } else {
          if (args[args.length - 1] instanceof Function) {
            buffers = args.slice(0, args.length - 1);
          } else {
            buffers = args;
          }
        }
        let size = 0;
        for (const buffer of buffers) {
          size += buffer.byteLength;
        }
        const res = new Uint8Array(size);
        let offset = 0;
        for (const buffer of buffers) {
          const view = this.toUint8Array(buffer);
          res.set(view, offset);
          offset += view.length;
        }
        if (args[args.length - 1] instanceof Function) {
          return this.toView(res, args[args.length - 1]);
        }
        return res.buffer;
      }
    };
    var STRING_TYPE = "string";
    var HEX_REGEX = /^[0-9a-f]+$/i;
    var BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    var BASE64URL_REGEX = /^[a-zA-Z0-9-_]+$/;
    var Utf8Converter = class {
      static fromString(text) {
        const s = unescape(encodeURIComponent(text));
        const uintArray = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) {
          uintArray[i] = s.charCodeAt(i);
        }
        return uintArray.buffer;
      }
      static toString(buffer) {
        const buf = BufferSourceConverter.toUint8Array(buffer);
        let encodedString = "";
        for (let i = 0; i < buf.length; i++) {
          encodedString += String.fromCharCode(buf[i]);
        }
        const decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
      }
    };
    var Utf16Converter = class {
      static toString(buffer, littleEndian = false) {
        const arrayBuffer = BufferSourceConverter.toArrayBuffer(buffer);
        const dataView = new DataView(arrayBuffer);
        let res = "";
        for (let i = 0; i < arrayBuffer.byteLength; i += 2) {
          const code2 = dataView.getUint16(i, littleEndian);
          res += String.fromCharCode(code2);
        }
        return res;
      }
      static fromString(text, littleEndian = false) {
        const res = new ArrayBuffer(text.length * 2);
        const dataView = new DataView(res);
        for (let i = 0; i < text.length; i++) {
          dataView.setUint16(i * 2, text.charCodeAt(i), littleEndian);
        }
        return res;
      }
    };
    var Convert = class _Convert {
      static isHex(data) {
        return typeof data === STRING_TYPE && HEX_REGEX.test(data);
      }
      static isBase64(data) {
        return typeof data === STRING_TYPE && BASE64_REGEX.test(data);
      }
      static isBase64Url(data) {
        return typeof data === STRING_TYPE && BASE64URL_REGEX.test(data);
      }
      static ToString(buffer, enc = "utf8") {
        const buf = BufferSourceConverter.toUint8Array(buffer);
        switch (enc.toLowerCase()) {
          case "utf8":
            return this.ToUtf8String(buf);
          case "binary":
            return this.ToBinary(buf);
          case "hex":
            return this.ToHex(buf);
          case "base64":
            return this.ToBase64(buf);
          case "base64url":
            return this.ToBase64Url(buf);
          case "utf16le":
            return Utf16Converter.toString(buf, true);
          case "utf16":
          case "utf16be":
            return Utf16Converter.toString(buf);
          default:
            throw new Error(`Unknown type of encoding '${enc}'`);
        }
      }
      static FromString(str, enc = "utf8") {
        if (!str) {
          return new ArrayBuffer(0);
        }
        switch (enc.toLowerCase()) {
          case "utf8":
            return this.FromUtf8String(str);
          case "binary":
            return this.FromBinary(str);
          case "hex":
            return this.FromHex(str);
          case "base64":
            return this.FromBase64(str);
          case "base64url":
            return this.FromBase64Url(str);
          case "utf16le":
            return Utf16Converter.fromString(str, true);
          case "utf16":
          case "utf16be":
            return Utf16Converter.fromString(str);
          default:
            throw new Error(`Unknown type of encoding '${enc}'`);
        }
      }
      static ToBase64(buffer) {
        const buf = BufferSourceConverter.toUint8Array(buffer);
        if (typeof btoa !== "undefined") {
          const binary = this.ToString(buf, "binary");
          return btoa(binary);
        } else {
          return Buffer.from(buf).toString("base64");
        }
      }
      static FromBase64(base642) {
        const formatted = this.formatString(base642);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!_Convert.isBase64(formatted)) {
          throw new TypeError("Argument 'base64Text' is not Base64 encoded");
        }
        if (typeof atob !== "undefined") {
          return this.FromBinary(atob(formatted));
        } else {
          return new Uint8Array(Buffer.from(formatted, "base64")).buffer;
        }
      }
      static FromBase64Url(base64url2) {
        const formatted = this.formatString(base64url2);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!_Convert.isBase64Url(formatted)) {
          throw new TypeError("Argument 'base64url' is not Base64Url encoded");
        }
        return this.FromBase64(this.Base64Padding(formatted.replace(/\-/g, "+").replace(/\_/g, "/")));
      }
      static ToBase64Url(data) {
        return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
      }
      static FromUtf8String(text, encoding = _Convert.DEFAULT_UTF8_ENCODING) {
        switch (encoding) {
          case "ascii":
            return this.FromBinary(text);
          case "utf8":
            return Utf8Converter.fromString(text);
          case "utf16":
          case "utf16be":
            return Utf16Converter.fromString(text);
          case "utf16le":
          case "usc2":
            return Utf16Converter.fromString(text, true);
          default:
            throw new Error(`Unknown type of encoding '${encoding}'`);
        }
      }
      static ToUtf8String(buffer, encoding = _Convert.DEFAULT_UTF8_ENCODING) {
        switch (encoding) {
          case "ascii":
            return this.ToBinary(buffer);
          case "utf8":
            return Utf8Converter.toString(buffer);
          case "utf16":
          case "utf16be":
            return Utf16Converter.toString(buffer);
          case "utf16le":
          case "usc2":
            return Utf16Converter.toString(buffer, true);
          default:
            throw new Error(`Unknown type of encoding '${encoding}'`);
        }
      }
      static FromBinary(text) {
        const stringLength = text.length;
        const resultView = new Uint8Array(stringLength);
        for (let i = 0; i < stringLength; i++) {
          resultView[i] = text.charCodeAt(i);
        }
        return resultView.buffer;
      }
      static ToBinary(buffer) {
        const buf = BufferSourceConverter.toUint8Array(buffer);
        let res = "";
        for (let i = 0; i < buf.length; i++) {
          res += String.fromCharCode(buf[i]);
        }
        return res;
      }
      static ToHex(buffer) {
        const buf = BufferSourceConverter.toUint8Array(buffer);
        let result = "";
        const len = buf.length;
        for (let i = 0; i < len; i++) {
          const byte = buf[i];
          if (byte < 16) {
            result += "0";
          }
          result += byte.toString(16);
        }
        return result;
      }
      static FromHex(hexString) {
        let formatted = this.formatString(hexString);
        if (!formatted) {
          return new ArrayBuffer(0);
        }
        if (!_Convert.isHex(formatted)) {
          throw new TypeError("Argument 'hexString' is not HEX encoded");
        }
        if (formatted.length % 2) {
          formatted = `0${formatted}`;
        }
        const res = new Uint8Array(formatted.length / 2);
        for (let i = 0; i < formatted.length; i = i + 2) {
          const c = formatted.slice(i, i + 2);
          res[i / 2] = parseInt(c, 16);
        }
        return res.buffer;
      }
      static ToUtf16String(buffer, littleEndian = false) {
        return Utf16Converter.toString(buffer, littleEndian);
      }
      static FromUtf16String(text, littleEndian = false) {
        return Utf16Converter.fromString(text, littleEndian);
      }
      static Base64Padding(base642) {
        const padCount = 4 - base642.length % 4;
        if (padCount < 4) {
          for (let i = 0; i < padCount; i++) {
            base642 += "=";
          }
        }
        return base642;
      }
      static formatString(data) {
        return (data === null || data === void 0 ? void 0 : data.replace(/[\n\r\t ]/g, "")) || "";
      }
    };
    Convert.DEFAULT_UTF8_ENCODING = "utf8";
    function assign(target, ...sources) {
      const res = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        const obj = arguments[i];
        for (const prop in obj) {
          res[prop] = obj[prop];
        }
      }
      return res;
    }
    function combine(...buf) {
      const totalByteLength = buf.map((item) => item.byteLength).reduce((prev, cur) => prev + cur);
      const res = new Uint8Array(totalByteLength);
      let currentPos = 0;
      buf.map((item) => new Uint8Array(item)).forEach((arr) => {
        for (const item2 of arr) {
          res[currentPos++] = item2;
        }
      });
      return res.buffer;
    }
    function isEqual(bytes1, bytes2) {
      if (!(bytes1 && bytes2)) {
        return false;
      }
      if (bytes1.byteLength !== bytes2.byteLength) {
        return false;
      }
      const b1 = new Uint8Array(bytes1);
      const b2 = new Uint8Array(bytes2);
      for (let i = 0; i < bytes1.byteLength; i++) {
        if (b1[i] !== b2[i]) {
          return false;
        }
      }
      return true;
    }
    exports.BufferSourceConverter = BufferSourceConverter;
    exports.Convert = Convert;
    exports.assign = assign;
    exports.combine = combine;
    exports.isEqual = isEqual;
  }
});

// node_modules/pvutils/build/utils.js
var require_utils = __commonJS({
  "node_modules/pvutils/build/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getUTCDate(date) {
      return new Date(date.getTime() + date.getTimezoneOffset() * 6e4);
    }
    function getParametersValue(parameters, name2, defaultValue) {
      var _a;
      if (parameters instanceof Object === false) {
        return defaultValue;
      }
      return (_a = parameters[name2]) !== null && _a !== void 0 ? _a : defaultValue;
    }
    function bufferToHexCodes(inputBuffer, inputOffset = 0, inputLength = inputBuffer.byteLength - inputOffset, insertSpace = false) {
      let result = "";
      for (const item of new Uint8Array(inputBuffer, inputOffset, inputLength)) {
        const str = item.toString(16).toUpperCase();
        if (str.length === 1) {
          result += "0";
        }
        result += str;
        if (insertSpace) {
          result += " ";
        }
      }
      return result.trim();
    }
    function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
      if (!(inputBuffer instanceof ArrayBuffer)) {
        baseBlock.error = 'Wrong parameter: inputBuffer must be "ArrayBuffer"';
        return false;
      }
      if (!inputBuffer.byteLength) {
        baseBlock.error = "Wrong parameter: inputBuffer has zero length";
        return false;
      }
      if (inputOffset < 0) {
        baseBlock.error = "Wrong parameter: inputOffset less than zero";
        return false;
      }
      if (inputLength < 0) {
        baseBlock.error = "Wrong parameter: inputLength less than zero";
        return false;
      }
      if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
        baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
        return false;
      }
      return true;
    }
    function utilFromBase(inputBuffer, inputBase) {
      let result = 0;
      if (inputBuffer.length === 1) {
        return inputBuffer[0];
      }
      for (let i = inputBuffer.length - 1; i >= 0; i--) {
        result += inputBuffer[inputBuffer.length - 1 - i] * Math.pow(2, inputBase * i);
      }
      return result;
    }
    function utilToBase(value, base3, reserved = -1) {
      const internalReserved = reserved;
      let internalValue = value;
      let result = 0;
      let biggest = Math.pow(2, base3);
      for (let i = 1; i < 8; i++) {
        if (value < biggest) {
          let retBuf;
          if (internalReserved < 0) {
            retBuf = new ArrayBuffer(i);
            result = i;
          } else {
            if (internalReserved < i) {
              return new ArrayBuffer(0);
            }
            retBuf = new ArrayBuffer(internalReserved);
            result = internalReserved;
          }
          const retView = new Uint8Array(retBuf);
          for (let j = i - 1; j >= 0; j--) {
            const basis = Math.pow(2, j * base3);
            retView[result - j - 1] = Math.floor(internalValue / basis);
            internalValue -= retView[result - j - 1] * basis;
          }
          return retBuf;
        }
        biggest *= Math.pow(2, base3);
      }
      return new ArrayBuffer(0);
    }
    function utilConcatBuf(...buffers) {
      let outputLength = 0;
      let prevLength = 0;
      for (const buffer of buffers) {
        outputLength += buffer.byteLength;
      }
      const retBuf = new ArrayBuffer(outputLength);
      const retView = new Uint8Array(retBuf);
      for (const buffer of buffers) {
        retView.set(new Uint8Array(buffer), prevLength);
        prevLength += buffer.byteLength;
      }
      return retBuf;
    }
    function utilConcatView(...views) {
      let outputLength = 0;
      let prevLength = 0;
      for (const view of views) {
        outputLength += view.length;
      }
      const retBuf = new ArrayBuffer(outputLength);
      const retView = new Uint8Array(retBuf);
      for (const view of views) {
        retView.set(view, prevLength);
        prevLength += view.length;
      }
      return retView;
    }
    function utilDecodeTC() {
      const buf = new Uint8Array(this.valueHex);
      if (this.valueHex.byteLength >= 2) {
        const condition1 = buf[0] === 255 && buf[1] & 128;
        const condition2 = buf[0] === 0 && (buf[1] & 128) === 0;
        if (condition1 || condition2) {
          this.warnings.push("Needlessly long format");
        }
      }
      const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
      const bigIntView = new Uint8Array(bigIntBuffer);
      for (let i = 0; i < this.valueHex.byteLength; i++) {
        bigIntView[i] = 0;
      }
      bigIntView[0] = buf[0] & 128;
      const bigInt = utilFromBase(bigIntView, 8);
      const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
      const smallIntView = new Uint8Array(smallIntBuffer);
      for (let j = 0; j < this.valueHex.byteLength; j++) {
        smallIntView[j] = buf[j];
      }
      smallIntView[0] &= 127;
      const smallInt = utilFromBase(smallIntView, 8);
      return smallInt - bigInt;
    }
    function utilEncodeTC(value) {
      const modValue = value < 0 ? value * -1 : value;
      let bigInt = 128;
      for (let i = 1; i < 8; i++) {
        if (modValue <= bigInt) {
          if (value < 0) {
            const smallInt = bigInt - modValue;
            const retBuf2 = utilToBase(smallInt, 8, i);
            const retView2 = new Uint8Array(retBuf2);
            retView2[0] |= 128;
            return retBuf2;
          }
          let retBuf = utilToBase(modValue, 8, i);
          let retView = new Uint8Array(retBuf);
          if (retView[0] & 128) {
            const tempBuf = retBuf.slice(0);
            const tempView = new Uint8Array(tempBuf);
            retBuf = new ArrayBuffer(retBuf.byteLength + 1);
            retView = new Uint8Array(retBuf);
            for (let k = 0; k < tempBuf.byteLength; k++) {
              retView[k + 1] = tempView[k];
            }
            retView[0] = 0;
          }
          return retBuf;
        }
        bigInt *= Math.pow(2, 8);
      }
      return new ArrayBuffer(0);
    }
    function isEqualBuffer(inputBuffer1, inputBuffer2) {
      if (inputBuffer1.byteLength !== inputBuffer2.byteLength) {
        return false;
      }
      const view1 = new Uint8Array(inputBuffer1);
      const view2 = new Uint8Array(inputBuffer2);
      for (let i = 0; i < view1.length; i++) {
        if (view1[i] !== view2[i]) {
          return false;
        }
      }
      return true;
    }
    function padNumber(inputNumber, fullLength) {
      const str = inputNumber.toString(10);
      if (fullLength < str.length) {
        return "";
      }
      const dif = fullLength - str.length;
      const padding = new Array(dif);
      for (let i = 0; i < dif; i++) {
        padding[i] = "0";
      }
      const paddingString = padding.join("");
      return paddingString.concat(str);
    }
    var base64Template = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var base64UrlTemplate = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
    function toBase64(input, useUrlTemplate = false, skipPadding = false, skipLeadingZeros = false) {
      let i = 0;
      let flag1 = 0;
      let flag2 = 0;
      let output2 = "";
      const template = useUrlTemplate ? base64UrlTemplate : base64Template;
      if (skipLeadingZeros) {
        let nonZeroPosition = 0;
        for (let i2 = 0; i2 < input.length; i2++) {
          if (input.charCodeAt(i2) !== 0) {
            nonZeroPosition = i2;
            break;
          }
        }
        input = input.slice(nonZeroPosition);
      }
      while (i < input.length) {
        const chr1 = input.charCodeAt(i++);
        if (i >= input.length) {
          flag1 = 1;
        }
        const chr2 = input.charCodeAt(i++);
        if (i >= input.length) {
          flag2 = 1;
        }
        const chr3 = input.charCodeAt(i++);
        const enc1 = chr1 >> 2;
        const enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        let enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        let enc4 = chr3 & 63;
        if (flag1 === 1) {
          enc3 = enc4 = 64;
        } else {
          if (flag2 === 1) {
            enc4 = 64;
          }
        }
        if (skipPadding) {
          if (enc3 === 64) {
            output2 += `${template.charAt(enc1)}${template.charAt(enc2)}`;
          } else {
            if (enc4 === 64) {
              output2 += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}`;
            } else {
              output2 += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}${template.charAt(enc4)}`;
            }
          }
        } else {
          output2 += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}${template.charAt(enc4)}`;
        }
      }
      return output2;
    }
    function fromBase64(input, useUrlTemplate = false, cutTailZeros = false) {
      const template = useUrlTemplate ? base64UrlTemplate : base64Template;
      function indexOf(toSearch) {
        for (let i2 = 0; i2 < 64; i2++) {
          if (template.charAt(i2) === toSearch)
            return i2;
        }
        return 64;
      }
      function test(incoming) {
        return incoming === 64 ? 0 : incoming;
      }
      let i = 0;
      let output2 = "";
      while (i < input.length) {
        const enc1 = indexOf(input.charAt(i++));
        const enc2 = i >= input.length ? 0 : indexOf(input.charAt(i++));
        const enc3 = i >= input.length ? 0 : indexOf(input.charAt(i++));
        const enc4 = i >= input.length ? 0 : indexOf(input.charAt(i++));
        const chr1 = test(enc1) << 2 | test(enc2) >> 4;
        const chr2 = (test(enc2) & 15) << 4 | test(enc3) >> 2;
        const chr3 = (test(enc3) & 3) << 6 | test(enc4);
        output2 += String.fromCharCode(chr1);
        if (enc3 !== 64) {
          output2 += String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
          output2 += String.fromCharCode(chr3);
        }
      }
      if (cutTailZeros) {
        const outputLength = output2.length;
        let nonZeroStart = -1;
        for (let i2 = outputLength - 1; i2 >= 0; i2--) {
          if (output2.charCodeAt(i2) !== 0) {
            nonZeroStart = i2;
            break;
          }
        }
        if (nonZeroStart !== -1) {
          output2 = output2.slice(0, nonZeroStart + 1);
        } else {
          output2 = "";
        }
      }
      return output2;
    }
    function arrayBufferToString(buffer) {
      let resultString = "";
      const view = new Uint8Array(buffer);
      for (const element of view) {
        resultString += String.fromCharCode(element);
      }
      return resultString;
    }
    function stringToArrayBuffer(str) {
      const stringLength = str.length;
      const resultBuffer = new ArrayBuffer(stringLength);
      const resultView = new Uint8Array(resultBuffer);
      for (let i = 0; i < stringLength; i++) {
        resultView[i] = str.charCodeAt(i);
      }
      return resultBuffer;
    }
    var log2 = Math.log(2);
    function nearestPowerOf2(length3) {
      const base3 = Math.log(length3) / log2;
      const floor = Math.floor(base3);
      const round = Math.round(base3);
      return floor === round ? floor : round;
    }
    function clearProps(object, propsArray) {
      for (const prop of propsArray) {
        delete object[prop];
      }
    }
    exports.arrayBufferToString = arrayBufferToString;
    exports.bufferToHexCodes = bufferToHexCodes;
    exports.checkBufferParams = checkBufferParams;
    exports.clearProps = clearProps;
    exports.fromBase64 = fromBase64;
    exports.getParametersValue = getParametersValue;
    exports.getUTCDate = getUTCDate;
    exports.isEqualBuffer = isEqualBuffer;
    exports.nearestPowerOf2 = nearestPowerOf2;
    exports.padNumber = padNumber;
    exports.stringToArrayBuffer = stringToArrayBuffer;
    exports.toBase64 = toBase64;
    exports.utilConcatBuf = utilConcatBuf;
    exports.utilConcatView = utilConcatView;
    exports.utilDecodeTC = utilDecodeTC;
    exports.utilEncodeTC = utilEncodeTC;
    exports.utilFromBase = utilFromBase;
    exports.utilToBase = utilToBase;
  }
});

// node_modules/asn1js/build/index.js
var require_build2 = __commonJS({
  "node_modules/asn1js/build/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var pvtsutils = require_build();
    var pvutils = require_utils();
    function _interopNamespace(e) {
      if (e && e.__esModule)
        return e;
      var n = /* @__PURE__ */ Object.create(null);
      if (e) {
        Object.keys(e).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        });
      }
      n["default"] = e;
      return Object.freeze(n);
    }
    var pvtsutils__namespace = /* @__PURE__ */ _interopNamespace(pvtsutils);
    var pvutils__namespace = /* @__PURE__ */ _interopNamespace(pvutils);
    function assertBigInt() {
      if (typeof BigInt === "undefined") {
        throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
      }
    }
    function concat2(buffers) {
      let outputLength = 0;
      let prevLength = 0;
      for (let i = 0; i < buffers.length; i++) {
        const buffer = buffers[i];
        outputLength += buffer.byteLength;
      }
      const retView = new Uint8Array(outputLength);
      for (let i = 0; i < buffers.length; i++) {
        const buffer = buffers[i];
        retView.set(new Uint8Array(buffer), prevLength);
        prevLength += buffer.byteLength;
      }
      return retView.buffer;
    }
    function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
      if (!(inputBuffer instanceof Uint8Array)) {
        baseBlock.error = "Wrong parameter: inputBuffer must be 'Uint8Array'";
        return false;
      }
      if (!inputBuffer.byteLength) {
        baseBlock.error = "Wrong parameter: inputBuffer has zero length";
        return false;
      }
      if (inputOffset < 0) {
        baseBlock.error = "Wrong parameter: inputOffset less than zero";
        return false;
      }
      if (inputLength < 0) {
        baseBlock.error = "Wrong parameter: inputLength less than zero";
        return false;
      }
      if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
        baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
        return false;
      }
      return true;
    }
    var ViewWriter = class {
      constructor() {
        this.items = [];
      }
      write(buf) {
        this.items.push(buf);
      }
      final() {
        return concat2(this.items);
      }
    };
    var powers2 = [new Uint8Array([1])];
    var digitsString = "0123456789";
    var NAME = "name";
    var VALUE_HEX_VIEW = "valueHexView";
    var IS_HEX_ONLY = "isHexOnly";
    var ID_BLOCK = "idBlock";
    var TAG_CLASS = "tagClass";
    var TAG_NUMBER = "tagNumber";
    var IS_CONSTRUCTED = "isConstructed";
    var FROM_BER = "fromBER";
    var TO_BER = "toBER";
    var LOCAL = "local";
    var EMPTY_STRING = "";
    var EMPTY_BUFFER = new ArrayBuffer(0);
    var EMPTY_VIEW = new Uint8Array(0);
    var END_OF_CONTENT_NAME = "EndOfContent";
    var OCTET_STRING_NAME = "OCTET STRING";
    var BIT_STRING_NAME = "BIT STRING";
    function HexBlock(BaseClass) {
      var _a2;
      return _a2 = class Some extends BaseClass {
        constructor(...args) {
          var _a3;
          super(...args);
          const params = args[0] || {};
          this.isHexOnly = (_a3 = params.isHexOnly) !== null && _a3 !== void 0 ? _a3 : false;
          this.valueHexView = params.valueHex ? pvtsutils__namespace.BufferSourceConverter.toUint8Array(params.valueHex) : EMPTY_VIEW;
        }
        get valueHex() {
          return this.valueHexView.slice().buffer;
        }
        set valueHex(value) {
          this.valueHexView = new Uint8Array(value);
        }
        fromBER(inputBuffer, inputOffset, inputLength) {
          const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
          if (!checkBufferParams(this, view, inputOffset, inputLength)) {
            return -1;
          }
          const endLength = inputOffset + inputLength;
          this.valueHexView = view.subarray(inputOffset, endLength);
          if (!this.valueHexView.length) {
            this.warnings.push("Zero buffer length");
            return inputOffset;
          }
          this.blockLength = inputLength;
          return endLength;
        }
        toBER(sizeOnly = false) {
          if (!this.isHexOnly) {
            this.error = "Flag 'isHexOnly' is not set, abort";
            return EMPTY_BUFFER;
          }
          if (sizeOnly) {
            return new ArrayBuffer(this.valueHexView.byteLength);
          }
          return this.valueHexView.byteLength === this.valueHexView.buffer.byteLength ? this.valueHexView.buffer : this.valueHexView.slice().buffer;
        }
        toJSON() {
          return {
            ...super.toJSON(),
            isHexOnly: this.isHexOnly,
            valueHex: pvtsutils__namespace.Convert.ToHex(this.valueHexView)
          };
        }
      }, _a2.NAME = "hexBlock", _a2;
    }
    var LocalBaseBlock = class {
      constructor({ blockLength = 0, error = EMPTY_STRING, warnings = [], valueBeforeDecode = EMPTY_VIEW } = {}) {
        this.blockLength = blockLength;
        this.error = error;
        this.warnings = warnings;
        this.valueBeforeDecodeView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(valueBeforeDecode);
      }
      static blockName() {
        return this.NAME;
      }
      get valueBeforeDecode() {
        return this.valueBeforeDecodeView.slice().buffer;
      }
      set valueBeforeDecode(value) {
        this.valueBeforeDecodeView = new Uint8Array(value);
      }
      toJSON() {
        return {
          blockName: this.constructor.NAME,
          blockLength: this.blockLength,
          error: this.error,
          warnings: this.warnings,
          valueBeforeDecode: pvtsutils__namespace.Convert.ToHex(this.valueBeforeDecodeView)
        };
      }
    };
    LocalBaseBlock.NAME = "baseBlock";
    var ValueBlock = class extends LocalBaseBlock {
      fromBER(inputBuffer, inputOffset, inputLength) {
        throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
      }
      toBER(sizeOnly, writer) {
        throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
      }
    };
    ValueBlock.NAME = "valueBlock";
    var LocalIdentificationBlock = class extends HexBlock(LocalBaseBlock) {
      constructor({ idBlock = {} } = {}) {
        var _a2, _b, _c, _d;
        super();
        if (idBlock) {
          this.isHexOnly = (_a2 = idBlock.isHexOnly) !== null && _a2 !== void 0 ? _a2 : false;
          this.valueHexView = idBlock.valueHex ? pvtsutils__namespace.BufferSourceConverter.toUint8Array(idBlock.valueHex) : EMPTY_VIEW;
          this.tagClass = (_b = idBlock.tagClass) !== null && _b !== void 0 ? _b : -1;
          this.tagNumber = (_c = idBlock.tagNumber) !== null && _c !== void 0 ? _c : -1;
          this.isConstructed = (_d = idBlock.isConstructed) !== null && _d !== void 0 ? _d : false;
        } else {
          this.tagClass = -1;
          this.tagNumber = -1;
          this.isConstructed = false;
        }
      }
      toBER(sizeOnly = false) {
        let firstOctet = 0;
        switch (this.tagClass) {
          case 1:
            firstOctet |= 0;
            break;
          case 2:
            firstOctet |= 64;
            break;
          case 3:
            firstOctet |= 128;
            break;
          case 4:
            firstOctet |= 192;
            break;
          default:
            this.error = "Unknown tag class";
            return EMPTY_BUFFER;
        }
        if (this.isConstructed)
          firstOctet |= 32;
        if (this.tagNumber < 31 && !this.isHexOnly) {
          const retView2 = new Uint8Array(1);
          if (!sizeOnly) {
            let number2 = this.tagNumber;
            number2 &= 31;
            firstOctet |= number2;
            retView2[0] = firstOctet;
          }
          return retView2.buffer;
        }
        if (!this.isHexOnly) {
          const encodedBuf = pvutils__namespace.utilToBase(this.tagNumber, 7);
          const encodedView = new Uint8Array(encodedBuf);
          const size = encodedBuf.byteLength;
          const retView2 = new Uint8Array(size + 1);
          retView2[0] = firstOctet | 31;
          if (!sizeOnly) {
            for (let i = 0; i < size - 1; i++)
              retView2[i + 1] = encodedView[i] | 128;
            retView2[size] = encodedView[size - 1];
          }
          return retView2.buffer;
        }
        const retView = new Uint8Array(this.valueHexView.byteLength + 1);
        retView[0] = firstOctet | 31;
        if (!sizeOnly) {
          const curView = this.valueHexView;
          for (let i = 0; i < curView.length - 1; i++)
            retView[i + 1] = curView[i] | 128;
          retView[this.valueHexView.byteLength] = curView[curView.length - 1];
        }
        return retView.buffer;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        const inputView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
          return -1;
        }
        const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
        if (intBuffer.length === 0) {
          this.error = "Zero buffer length";
          return -1;
        }
        const tagClassMask = intBuffer[0] & 192;
        switch (tagClassMask) {
          case 0:
            this.tagClass = 1;
            break;
          case 64:
            this.tagClass = 2;
            break;
          case 128:
            this.tagClass = 3;
            break;
          case 192:
            this.tagClass = 4;
            break;
          default:
            this.error = "Unknown tag class";
            return -1;
        }
        this.isConstructed = (intBuffer[0] & 32) === 32;
        this.isHexOnly = false;
        const tagNumberMask = intBuffer[0] & 31;
        if (tagNumberMask !== 31) {
          this.tagNumber = tagNumberMask;
          this.blockLength = 1;
        } else {
          let count = 1;
          let intTagNumberBuffer = this.valueHexView = new Uint8Array(255);
          let tagNumberBufferMaxLength = 255;
          while (intBuffer[count] & 128) {
            intTagNumberBuffer[count - 1] = intBuffer[count] & 127;
            count++;
            if (count >= intBuffer.length) {
              this.error = "End of input reached before message was fully decoded";
              return -1;
            }
            if (count === tagNumberBufferMaxLength) {
              tagNumberBufferMaxLength += 255;
              const tempBufferView2 = new Uint8Array(tagNumberBufferMaxLength);
              for (let i = 0; i < intTagNumberBuffer.length; i++)
                tempBufferView2[i] = intTagNumberBuffer[i];
              intTagNumberBuffer = this.valueHexView = new Uint8Array(tagNumberBufferMaxLength);
            }
          }
          this.blockLength = count + 1;
          intTagNumberBuffer[count - 1] = intBuffer[count] & 127;
          const tempBufferView = new Uint8Array(count);
          for (let i = 0; i < count; i++)
            tempBufferView[i] = intTagNumberBuffer[i];
          intTagNumberBuffer = this.valueHexView = new Uint8Array(count);
          intTagNumberBuffer.set(tempBufferView);
          if (this.blockLength <= 9)
            this.tagNumber = pvutils__namespace.utilFromBase(intTagNumberBuffer, 7);
          else {
            this.isHexOnly = true;
            this.warnings.push("Tag too long, represented as hex-coded");
          }
        }
        if (this.tagClass === 1 && this.isConstructed) {
          switch (this.tagNumber) {
            case 1:
            case 2:
            case 5:
            case 6:
            case 9:
            case 13:
            case 14:
            case 23:
            case 24:
            case 31:
            case 32:
            case 33:
            case 34:
              this.error = "Constructed encoding used for primitive type";
              return -1;
          }
        }
        return inputOffset + this.blockLength;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          tagClass: this.tagClass,
          tagNumber: this.tagNumber,
          isConstructed: this.isConstructed
        };
      }
    };
    LocalIdentificationBlock.NAME = "identificationBlock";
    var LocalLengthBlock = class extends LocalBaseBlock {
      constructor({ lenBlock = {} } = {}) {
        var _a2, _b, _c;
        super();
        this.isIndefiniteForm = (_a2 = lenBlock.isIndefiniteForm) !== null && _a2 !== void 0 ? _a2 : false;
        this.longFormUsed = (_b = lenBlock.longFormUsed) !== null && _b !== void 0 ? _b : false;
        this.length = (_c = lenBlock.length) !== null && _c !== void 0 ? _c : 0;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        const view = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, view, inputOffset, inputLength)) {
          return -1;
        }
        const intBuffer = view.subarray(inputOffset, inputOffset + inputLength);
        if (intBuffer.length === 0) {
          this.error = "Zero buffer length";
          return -1;
        }
        if (intBuffer[0] === 255) {
          this.error = "Length block 0xFF is reserved by standard";
          return -1;
        }
        this.isIndefiniteForm = intBuffer[0] === 128;
        if (this.isIndefiniteForm) {
          this.blockLength = 1;
          return inputOffset + this.blockLength;
        }
        this.longFormUsed = !!(intBuffer[0] & 128);
        if (this.longFormUsed === false) {
          this.length = intBuffer[0];
          this.blockLength = 1;
          return inputOffset + this.blockLength;
        }
        const count = intBuffer[0] & 127;
        if (count > 8) {
          this.error = "Too big integer";
          return -1;
        }
        if (count + 1 > intBuffer.length) {
          this.error = "End of input reached before message was fully decoded";
          return -1;
        }
        const lenOffset = inputOffset + 1;
        const lengthBufferView = view.subarray(lenOffset, lenOffset + count);
        if (lengthBufferView[count - 1] === 0)
          this.warnings.push("Needlessly long encoded length");
        this.length = pvutils__namespace.utilFromBase(lengthBufferView, 8);
        if (this.longFormUsed && this.length <= 127)
          this.warnings.push("Unnecessary usage of long length form");
        this.blockLength = count + 1;
        return inputOffset + this.blockLength;
      }
      toBER(sizeOnly = false) {
        let retBuf;
        let retView;
        if (this.length > 127)
          this.longFormUsed = true;
        if (this.isIndefiniteForm) {
          retBuf = new ArrayBuffer(1);
          if (sizeOnly === false) {
            retView = new Uint8Array(retBuf);
            retView[0] = 128;
          }
          return retBuf;
        }
        if (this.longFormUsed) {
          const encodedBuf = pvutils__namespace.utilToBase(this.length, 8);
          if (encodedBuf.byteLength > 127) {
            this.error = "Too big length";
            return EMPTY_BUFFER;
          }
          retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
          if (sizeOnly)
            return retBuf;
          const encodedView = new Uint8Array(encodedBuf);
          retView = new Uint8Array(retBuf);
          retView[0] = encodedBuf.byteLength | 128;
          for (let i = 0; i < encodedBuf.byteLength; i++)
            retView[i + 1] = encodedView[i];
          return retBuf;
        }
        retBuf = new ArrayBuffer(1);
        if (sizeOnly === false) {
          retView = new Uint8Array(retBuf);
          retView[0] = this.length;
        }
        return retBuf;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          isIndefiniteForm: this.isIndefiniteForm,
          longFormUsed: this.longFormUsed,
          length: this.length
        };
      }
    };
    LocalLengthBlock.NAME = "lengthBlock";
    var typeStore = {};
    var BaseBlock = class extends LocalBaseBlock {
      constructor({ name: name2 = EMPTY_STRING, optional = false, primitiveSchema, ...parameters } = {}, valueBlockType) {
        super(parameters);
        this.name = name2;
        this.optional = optional;
        if (primitiveSchema) {
          this.primitiveSchema = primitiveSchema;
        }
        this.idBlock = new LocalIdentificationBlock(parameters);
        this.lenBlock = new LocalLengthBlock(parameters);
        this.valueBlock = valueBlockType ? new valueBlockType(parameters) : new ValueBlock(parameters);
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }
        if (!this.idBlock.error.length)
          this.blockLength += this.idBlock.blockLength;
        if (!this.lenBlock.error.length)
          this.blockLength += this.lenBlock.blockLength;
        if (!this.valueBlock.error.length)
          this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }
      toBER(sizeOnly, writer) {
        const _writer = writer || new ViewWriter();
        if (!writer) {
          prepareIndefiniteForm(this);
        }
        const idBlockBuf = this.idBlock.toBER(sizeOnly);
        _writer.write(idBlockBuf);
        if (this.lenBlock.isIndefiniteForm) {
          _writer.write(new Uint8Array([128]).buffer);
          this.valueBlock.toBER(sizeOnly, _writer);
          _writer.write(new ArrayBuffer(2));
        } else {
          const valueBlockBuf = this.valueBlock.toBER(sizeOnly);
          this.lenBlock.length = valueBlockBuf.byteLength;
          const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
          _writer.write(lenBlockBuf);
          _writer.write(valueBlockBuf);
        }
        if (!writer) {
          return _writer.final();
        }
        return EMPTY_BUFFER;
      }
      toJSON() {
        const object = {
          ...super.toJSON(),
          idBlock: this.idBlock.toJSON(),
          lenBlock: this.lenBlock.toJSON(),
          valueBlock: this.valueBlock.toJSON(),
          name: this.name,
          optional: this.optional
        };
        if (this.primitiveSchema)
          object.primitiveSchema = this.primitiveSchema.toJSON();
        return object;
      }
      toString(encoding = "ascii") {
        if (encoding === "ascii") {
          return this.onAsciiEncoding();
        }
        return pvtsutils__namespace.Convert.ToHex(this.toBER());
      }
      onAsciiEncoding() {
        return `${this.constructor.NAME} : ${pvtsutils__namespace.Convert.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
      }
      isEqual(other) {
        if (this === other) {
          return true;
        }
        if (!(other instanceof this.constructor)) {
          return false;
        }
        const thisRaw = this.toBER();
        const otherRaw = other.toBER();
        return pvutils__namespace.isEqualBuffer(thisRaw, otherRaw);
      }
    };
    BaseBlock.NAME = "BaseBlock";
    function prepareIndefiniteForm(baseBlock) {
      if (baseBlock instanceof typeStore.Constructed) {
        for (const value of baseBlock.valueBlock.value) {
          if (prepareIndefiniteForm(value)) {
            baseBlock.lenBlock.isIndefiniteForm = true;
          }
        }
      }
      return !!baseBlock.lenBlock.isIndefiniteForm;
    }
    var BaseStringBlock = class extends BaseBlock {
      constructor({ value = EMPTY_STRING, ...parameters } = {}, stringValueBlockType) {
        super(parameters, stringValueBlockType);
        if (value) {
          this.fromString(value);
        }
      }
      getValue() {
        return this.valueBlock.value;
      }
      setValue(value) {
        this.valueBlock.value = value;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }
        this.fromBuffer(this.valueBlock.valueHexView);
        if (!this.idBlock.error.length)
          this.blockLength += this.idBlock.blockLength;
        if (!this.lenBlock.error.length)
          this.blockLength += this.lenBlock.blockLength;
        if (!this.valueBlock.error.length)
          this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }
      onAsciiEncoding() {
        return `${this.constructor.NAME} : '${this.valueBlock.value}'`;
      }
    };
    BaseStringBlock.NAME = "BaseStringBlock";
    var LocalPrimitiveValueBlock = class extends HexBlock(ValueBlock) {
      constructor({ isHexOnly = true, ...parameters } = {}) {
        super(parameters);
        this.isHexOnly = isHexOnly;
      }
    };
    LocalPrimitiveValueBlock.NAME = "PrimitiveValueBlock";
    var _a$w;
    var Primitive = class extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalPrimitiveValueBlock);
        this.idBlock.isConstructed = false;
      }
    };
    _a$w = Primitive;
    (() => {
      typeStore.Primitive = _a$w;
    })();
    Primitive.NAME = "PRIMITIVE";
    function localChangeType(inputObject, newType) {
      if (inputObject instanceof newType) {
        return inputObject;
      }
      const newObject = new newType();
      newObject.idBlock = inputObject.idBlock;
      newObject.lenBlock = inputObject.lenBlock;
      newObject.warnings = inputObject.warnings;
      newObject.valueBeforeDecodeView = inputObject.valueBeforeDecodeView;
      return newObject;
    }
    function localFromBER(inputBuffer, inputOffset = 0, inputLength = inputBuffer.length) {
      const incomingOffset = inputOffset;
      let returnObject = new BaseBlock({}, ValueBlock);
      const baseBlock = new LocalBaseBlock();
      if (!checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength)) {
        returnObject.error = baseBlock.error;
        return {
          offset: -1,
          result: returnObject
        };
      }
      const intBuffer = inputBuffer.subarray(inputOffset, inputOffset + inputLength);
      if (!intBuffer.length) {
        returnObject.error = "Zero buffer length";
        return {
          offset: -1,
          result: returnObject
        };
      }
      let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
      if (returnObject.idBlock.warnings.length) {
        returnObject.warnings.concat(returnObject.idBlock.warnings);
      }
      if (resultOffset === -1) {
        returnObject.error = returnObject.idBlock.error;
        return {
          offset: -1,
          result: returnObject
        };
      }
      inputOffset = resultOffset;
      inputLength -= returnObject.idBlock.blockLength;
      resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
      if (returnObject.lenBlock.warnings.length) {
        returnObject.warnings.concat(returnObject.lenBlock.warnings);
      }
      if (resultOffset === -1) {
        returnObject.error = returnObject.lenBlock.error;
        return {
          offset: -1,
          result: returnObject
        };
      }
      inputOffset = resultOffset;
      inputLength -= returnObject.lenBlock.blockLength;
      if (!returnObject.idBlock.isConstructed && returnObject.lenBlock.isIndefiniteForm) {
        returnObject.error = "Indefinite length form used for primitive encoding form";
        return {
          offset: -1,
          result: returnObject
        };
      }
      let newASN1Type = BaseBlock;
      switch (returnObject.idBlock.tagClass) {
        case 1:
          if (returnObject.idBlock.tagNumber >= 37 && returnObject.idBlock.isHexOnly === false) {
            returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
            return {
              offset: -1,
              result: returnObject
            };
          }
          switch (returnObject.idBlock.tagNumber) {
            case 0:
              if (returnObject.idBlock.isConstructed && returnObject.lenBlock.length > 0) {
                returnObject.error = "Type [UNIVERSAL 0] is reserved";
                return {
                  offset: -1,
                  result: returnObject
                };
              }
              newASN1Type = typeStore.EndOfContent;
              break;
            case 1:
              newASN1Type = typeStore.Boolean;
              break;
            case 2:
              newASN1Type = typeStore.Integer;
              break;
            case 3:
              newASN1Type = typeStore.BitString;
              break;
            case 4:
              newASN1Type = typeStore.OctetString;
              break;
            case 5:
              newASN1Type = typeStore.Null;
              break;
            case 6:
              newASN1Type = typeStore.ObjectIdentifier;
              break;
            case 10:
              newASN1Type = typeStore.Enumerated;
              break;
            case 12:
              newASN1Type = typeStore.Utf8String;
              break;
            case 13:
              newASN1Type = typeStore.RelativeObjectIdentifier;
              break;
            case 14:
              newASN1Type = typeStore.TIME;
              break;
            case 15:
              returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
              return {
                offset: -1,
                result: returnObject
              };
            case 16:
              newASN1Type = typeStore.Sequence;
              break;
            case 17:
              newASN1Type = typeStore.Set;
              break;
            case 18:
              newASN1Type = typeStore.NumericString;
              break;
            case 19:
              newASN1Type = typeStore.PrintableString;
              break;
            case 20:
              newASN1Type = typeStore.TeletexString;
              break;
            case 21:
              newASN1Type = typeStore.VideotexString;
              break;
            case 22:
              newASN1Type = typeStore.IA5String;
              break;
            case 23:
              newASN1Type = typeStore.UTCTime;
              break;
            case 24:
              newASN1Type = typeStore.GeneralizedTime;
              break;
            case 25:
              newASN1Type = typeStore.GraphicString;
              break;
            case 26:
              newASN1Type = typeStore.VisibleString;
              break;
            case 27:
              newASN1Type = typeStore.GeneralString;
              break;
            case 28:
              newASN1Type = typeStore.UniversalString;
              break;
            case 29:
              newASN1Type = typeStore.CharacterString;
              break;
            case 30:
              newASN1Type = typeStore.BmpString;
              break;
            case 31:
              newASN1Type = typeStore.DATE;
              break;
            case 32:
              newASN1Type = typeStore.TimeOfDay;
              break;
            case 33:
              newASN1Type = typeStore.DateTime;
              break;
            case 34:
              newASN1Type = typeStore.Duration;
              break;
            default: {
              const newObject = returnObject.idBlock.isConstructed ? new typeStore.Constructed() : new typeStore.Primitive();
              newObject.idBlock = returnObject.idBlock;
              newObject.lenBlock = returnObject.lenBlock;
              newObject.warnings = returnObject.warnings;
              returnObject = newObject;
            }
          }
          break;
        case 2:
        case 3:
        case 4:
        default: {
          newASN1Type = returnObject.idBlock.isConstructed ? typeStore.Constructed : typeStore.Primitive;
        }
      }
      returnObject = localChangeType(returnObject, newASN1Type);
      resultOffset = returnObject.fromBER(inputBuffer, inputOffset, returnObject.lenBlock.isIndefiniteForm ? inputLength : returnObject.lenBlock.length);
      returnObject.valueBeforeDecodeView = inputBuffer.subarray(incomingOffset, incomingOffset + returnObject.blockLength);
      return {
        offset: resultOffset,
        result: returnObject
      };
    }
    function fromBER2(inputBuffer) {
      if (!inputBuffer.byteLength) {
        const result = new BaseBlock({}, ValueBlock);
        result.error = "Input buffer has zero length";
        return {
          offset: -1,
          result
        };
      }
      return localFromBER(pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer).slice(), 0, inputBuffer.byteLength);
    }
    function checkLen(indefiniteLength, length3) {
      if (indefiniteLength) {
        return 1;
      }
      return length3;
    }
    var LocalConstructedValueBlock = class extends ValueBlock {
      constructor({ value = [], isIndefiniteForm = false, ...parameters } = {}) {
        super(parameters);
        this.value = value;
        this.isIndefiniteForm = isIndefiniteForm;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        const view = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, view, inputOffset, inputLength)) {
          return -1;
        }
        this.valueBeforeDecodeView = view.subarray(inputOffset, inputOffset + inputLength);
        if (this.valueBeforeDecodeView.length === 0) {
          this.warnings.push("Zero buffer length");
          return inputOffset;
        }
        let currentOffset = inputOffset;
        while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
          const returnObject = localFromBER(view, currentOffset, inputLength);
          if (returnObject.offset === -1) {
            this.error = returnObject.result.error;
            this.warnings.concat(returnObject.result.warnings);
            return -1;
          }
          currentOffset = returnObject.offset;
          this.blockLength += returnObject.result.blockLength;
          inputLength -= returnObject.result.blockLength;
          this.value.push(returnObject.result);
          if (this.isIndefiniteForm && returnObject.result.constructor.NAME === END_OF_CONTENT_NAME) {
            break;
          }
        }
        if (this.isIndefiniteForm) {
          if (this.value[this.value.length - 1].constructor.NAME === END_OF_CONTENT_NAME) {
            this.value.pop();
          } else {
            this.warnings.push("No EndOfContent block encoded");
          }
        }
        return currentOffset;
      }
      toBER(sizeOnly, writer) {
        const _writer = writer || new ViewWriter();
        for (let i = 0; i < this.value.length; i++) {
          this.value[i].toBER(sizeOnly, _writer);
        }
        if (!writer) {
          return _writer.final();
        }
        return EMPTY_BUFFER;
      }
      toJSON() {
        const object = {
          ...super.toJSON(),
          isIndefiniteForm: this.isIndefiniteForm,
          value: []
        };
        for (const value of this.value) {
          object.value.push(value.toJSON());
        }
        return object;
      }
    };
    LocalConstructedValueBlock.NAME = "ConstructedValueBlock";
    var _a$v;
    var Constructed = class extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalConstructedValueBlock);
        this.idBlock.isConstructed = true;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
        const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
        if (resultOffset === -1) {
          this.error = this.valueBlock.error;
          return resultOffset;
        }
        if (!this.idBlock.error.length)
          this.blockLength += this.idBlock.blockLength;
        if (!this.lenBlock.error.length)
          this.blockLength += this.lenBlock.blockLength;
        if (!this.valueBlock.error.length)
          this.blockLength += this.valueBlock.blockLength;
        return resultOffset;
      }
      onAsciiEncoding() {
        const values = [];
        for (const value of this.valueBlock.value) {
          values.push(value.toString("ascii").split("\n").map((o) => `  ${o}`).join("\n"));
        }
        const blockName = this.idBlock.tagClass === 3 ? `[${this.idBlock.tagNumber}]` : this.constructor.NAME;
        return values.length ? `${blockName} :
${values.join("\n")}` : `${blockName} :`;
      }
    };
    _a$v = Constructed;
    (() => {
      typeStore.Constructed = _a$v;
    })();
    Constructed.NAME = "CONSTRUCTED";
    var LocalEndOfContentValueBlock = class extends ValueBlock {
      fromBER(inputBuffer, inputOffset, inputLength) {
        return inputOffset;
      }
      toBER(sizeOnly) {
        return EMPTY_BUFFER;
      }
    };
    LocalEndOfContentValueBlock.override = "EndOfContentValueBlock";
    var _a$u;
    var EndOfContent = class extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalEndOfContentValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 0;
      }
    };
    _a$u = EndOfContent;
    (() => {
      typeStore.EndOfContent = _a$u;
    })();
    EndOfContent.NAME = END_OF_CONTENT_NAME;
    var _a$t;
    var Null2 = class extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, ValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 5;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        if (this.lenBlock.length > 0)
          this.warnings.push("Non-zero length of value block for Null type");
        if (!this.idBlock.error.length)
          this.blockLength += this.idBlock.blockLength;
        if (!this.lenBlock.error.length)
          this.blockLength += this.lenBlock.blockLength;
        this.blockLength += inputLength;
        if (inputOffset + inputLength > inputBuffer.byteLength) {
          this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
          return -1;
        }
        return inputOffset + inputLength;
      }
      toBER(sizeOnly, writer) {
        const retBuf = new ArrayBuffer(2);
        if (!sizeOnly) {
          const retView = new Uint8Array(retBuf);
          retView[0] = 5;
          retView[1] = 0;
        }
        if (writer) {
          writer.write(retBuf);
        }
        return retBuf;
      }
      onAsciiEncoding() {
        return `${this.constructor.NAME}`;
      }
    };
    _a$t = Null2;
    (() => {
      typeStore.Null = _a$t;
    })();
    Null2.NAME = "NULL";
    var LocalBooleanValueBlock = class extends HexBlock(ValueBlock) {
      constructor({ value, ...parameters } = {}) {
        super(parameters);
        if (parameters.valueHex) {
          this.valueHexView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(parameters.valueHex);
        } else {
          this.valueHexView = new Uint8Array(1);
        }
        if (value) {
          this.value = value;
        }
      }
      get value() {
        for (const octet of this.valueHexView) {
          if (octet > 0) {
            return true;
          }
        }
        return false;
      }
      set value(value) {
        this.valueHexView[0] = value ? 255 : 0;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        const inputView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
          return -1;
        }
        this.valueHexView = inputView.subarray(inputOffset, inputOffset + inputLength);
        if (inputLength > 1)
          this.warnings.push("Boolean value encoded in more then 1 octet");
        this.isHexOnly = true;
        pvutils__namespace.utilDecodeTC.call(this);
        this.blockLength = inputLength;
        return inputOffset + inputLength;
      }
      toBER() {
        return this.valueHexView.slice();
      }
      toJSON() {
        return {
          ...super.toJSON(),
          value: this.value
        };
      }
    };
    LocalBooleanValueBlock.NAME = "BooleanValueBlock";
    var _a$s;
    var Boolean2 = class extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalBooleanValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 1;
      }
      getValue() {
        return this.valueBlock.value;
      }
      setValue(value) {
        this.valueBlock.value = value;
      }
      onAsciiEncoding() {
        return `${this.constructor.NAME} : ${this.getValue}`;
      }
    };
    _a$s = Boolean2;
    (() => {
      typeStore.Boolean = _a$s;
    })();
    Boolean2.NAME = "BOOLEAN";
    var LocalOctetStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
      constructor({ isConstructed = false, ...parameters } = {}) {
        super(parameters);
        this.isConstructed = isConstructed;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        let resultOffset = 0;
        if (this.isConstructed) {
          this.isHexOnly = false;
          resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
          if (resultOffset === -1)
            return resultOffset;
          for (let i = 0; i < this.value.length; i++) {
            const currentBlockName = this.value[i].constructor.NAME;
            if (currentBlockName === END_OF_CONTENT_NAME) {
              if (this.isIndefiniteForm)
                break;
              else {
                this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
                return -1;
              }
            }
            if (currentBlockName !== OCTET_STRING_NAME) {
              this.error = "OCTET STRING may consists of OCTET STRINGs only";
              return -1;
            }
          }
        } else {
          this.isHexOnly = true;
          resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
          this.blockLength = inputLength;
        }
        return resultOffset;
      }
      toBER(sizeOnly, writer) {
        if (this.isConstructed)
          return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
        return sizeOnly ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.slice().buffer;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          isConstructed: this.isConstructed
        };
      }
    };
    LocalOctetStringValueBlock.NAME = "OctetStringValueBlock";
    var _a$r;
    var OctetString2 = class _OctetString extends BaseBlock {
      constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
        var _b, _c;
        (_b = parameters.isConstructed) !== null && _b !== void 0 ? _b : parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length);
        super({
          idBlock: {
            isConstructed: parameters.isConstructed,
            ...idBlock
          },
          lenBlock: {
            ...lenBlock,
            isIndefiniteForm: !!parameters.isIndefiniteForm
          },
          ...parameters
        }, LocalOctetStringValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 4;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        this.valueBlock.isConstructed = this.idBlock.isConstructed;
        this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
        if (inputLength === 0) {
          if (this.idBlock.error.length === 0)
            this.blockLength += this.idBlock.blockLength;
          if (this.lenBlock.error.length === 0)
            this.blockLength += this.lenBlock.blockLength;
          return inputOffset;
        }
        if (!this.valueBlock.isConstructed) {
          const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
          const buf = view.subarray(inputOffset, inputOffset + inputLength);
          try {
            if (buf.byteLength) {
              const asn = localFromBER(buf, 0, buf.byteLength);
              if (asn.offset !== -1 && asn.offset === inputLength) {
                this.valueBlock.value = [asn.result];
              }
            }
          } catch (e) {
          }
        }
        return super.fromBER(inputBuffer, inputOffset, inputLength);
      }
      onAsciiEncoding() {
        if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) {
          return Constructed.prototype.onAsciiEncoding.call(this);
        }
        return `${this.constructor.NAME} : ${pvtsutils__namespace.Convert.ToHex(this.valueBlock.valueHexView)}`;
      }
      getValue() {
        if (!this.idBlock.isConstructed) {
          return this.valueBlock.valueHexView.slice().buffer;
        }
        const array = [];
        for (const content of this.valueBlock.value) {
          if (content instanceof _OctetString) {
            array.push(content.valueBlock.valueHexView);
          }
        }
        return pvtsutils__namespace.BufferSourceConverter.concat(array);
      }
    };
    _a$r = OctetString2;
    (() => {
      typeStore.OctetString = _a$r;
    })();
    OctetString2.NAME = OCTET_STRING_NAME;
    var LocalBitStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
      constructor({ unusedBits = 0, isConstructed = false, ...parameters } = {}) {
        super(parameters);
        this.unusedBits = unusedBits;
        this.isConstructed = isConstructed;
        this.blockLength = this.valueHexView.byteLength;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        if (!inputLength) {
          return inputOffset;
        }
        let resultOffset = -1;
        if (this.isConstructed) {
          resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
          if (resultOffset === -1)
            return resultOffset;
          for (const value of this.value) {
            const currentBlockName = value.constructor.NAME;
            if (currentBlockName === END_OF_CONTENT_NAME) {
              if (this.isIndefiniteForm)
                break;
              else {
                this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
                return -1;
              }
            }
            if (currentBlockName !== BIT_STRING_NAME) {
              this.error = "BIT STRING may consists of BIT STRINGs only";
              return -1;
            }
            const valueBlock = value.valueBlock;
            if (this.unusedBits > 0 && valueBlock.unusedBits > 0) {
              this.error = 'Using of "unused bits" inside constructive BIT STRING allowed for least one only';
              return -1;
            }
            this.unusedBits = valueBlock.unusedBits;
          }
          return resultOffset;
        }
        const inputView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
          return -1;
        }
        const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
        this.unusedBits = intBuffer[0];
        if (this.unusedBits > 7) {
          this.error = "Unused bits for BitString must be in range 0-7";
          return -1;
        }
        if (!this.unusedBits) {
          const buf = intBuffer.subarray(1);
          try {
            if (buf.byteLength) {
              const asn = localFromBER(buf, 0, buf.byteLength);
              if (asn.offset !== -1 && asn.offset === inputLength - 1) {
                this.value = [asn.result];
              }
            }
          } catch (e) {
          }
        }
        this.valueHexView = intBuffer.subarray(1);
        this.blockLength = intBuffer.length;
        return inputOffset + inputLength;
      }
      toBER(sizeOnly, writer) {
        if (this.isConstructed) {
          return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
        }
        if (sizeOnly) {
          return new ArrayBuffer(this.valueHexView.byteLength + 1);
        }
        if (!this.valueHexView.byteLength) {
          return EMPTY_BUFFER;
        }
        const retView = new Uint8Array(this.valueHexView.length + 1);
        retView[0] = this.unusedBits;
        retView.set(this.valueHexView, 1);
        return retView.buffer;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          unusedBits: this.unusedBits,
          isConstructed: this.isConstructed
        };
      }
    };
    LocalBitStringValueBlock.NAME = "BitStringValueBlock";
    var _a$q;
    var BitString2 = class extends BaseBlock {
      constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
        var _b, _c;
        (_b = parameters.isConstructed) !== null && _b !== void 0 ? _b : parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length);
        super({
          idBlock: {
            isConstructed: parameters.isConstructed,
            ...idBlock
          },
          lenBlock: {
            ...lenBlock,
            isIndefiniteForm: !!parameters.isIndefiniteForm
          },
          ...parameters
        }, LocalBitStringValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 3;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        this.valueBlock.isConstructed = this.idBlock.isConstructed;
        this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
        return super.fromBER(inputBuffer, inputOffset, inputLength);
      }
      onAsciiEncoding() {
        if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) {
          return Constructed.prototype.onAsciiEncoding.call(this);
        } else {
          const bits = [];
          const valueHex = this.valueBlock.valueHexView;
          for (const byte of valueHex) {
            bits.push(byte.toString(2).padStart(8, "0"));
          }
          const bitsStr = bits.join("");
          return `${this.constructor.NAME} : ${bitsStr.substring(0, bitsStr.length - this.valueBlock.unusedBits)}`;
        }
      }
    };
    _a$q = BitString2;
    (() => {
      typeStore.BitString = _a$q;
    })();
    BitString2.NAME = BIT_STRING_NAME;
    var _a$p;
    function viewAdd(first, second) {
      const c = new Uint8Array([0]);
      const firstView = new Uint8Array(first);
      const secondView = new Uint8Array(second);
      let firstViewCopy = firstView.slice(0);
      const firstViewCopyLength = firstViewCopy.length - 1;
      const secondViewCopy = secondView.slice(0);
      const secondViewCopyLength = secondViewCopy.length - 1;
      let value = 0;
      const max = secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
      let counter = 0;
      for (let i = max; i >= 0; i--, counter++) {
        switch (true) {
          case counter < secondViewCopy.length:
            value = firstViewCopy[firstViewCopyLength - counter] + secondViewCopy[secondViewCopyLength - counter] + c[0];
            break;
          default:
            value = firstViewCopy[firstViewCopyLength - counter] + c[0];
        }
        c[0] = value / 10;
        switch (true) {
          case counter >= firstViewCopy.length:
            firstViewCopy = pvutils__namespace.utilConcatView(new Uint8Array([value % 10]), firstViewCopy);
            break;
          default:
            firstViewCopy[firstViewCopyLength - counter] = value % 10;
        }
      }
      if (c[0] > 0)
        firstViewCopy = pvutils__namespace.utilConcatView(c, firstViewCopy);
      return firstViewCopy;
    }
    function power2(n) {
      if (n >= powers2.length) {
        for (let p = powers2.length; p <= n; p++) {
          const c = new Uint8Array([0]);
          let digits = powers2[p - 1].slice(0);
          for (let i = digits.length - 1; i >= 0; i--) {
            const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
            c[0] = newValue[0] / 10;
            digits[i] = newValue[0] % 10;
          }
          if (c[0] > 0)
            digits = pvutils__namespace.utilConcatView(c, digits);
          powers2.push(digits);
        }
      }
      return powers2[n];
    }
    function viewSub(first, second) {
      let b = 0;
      const firstView = new Uint8Array(first);
      const secondView = new Uint8Array(second);
      const firstViewCopy = firstView.slice(0);
      const firstViewCopyLength = firstViewCopy.length - 1;
      const secondViewCopy = secondView.slice(0);
      const secondViewCopyLength = secondViewCopy.length - 1;
      let value;
      let counter = 0;
      for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
        value = firstViewCopy[firstViewCopyLength - counter] - secondViewCopy[secondViewCopyLength - counter] - b;
        switch (true) {
          case value < 0:
            b = 1;
            firstViewCopy[firstViewCopyLength - counter] = value + 10;
            break;
          default:
            b = 0;
            firstViewCopy[firstViewCopyLength - counter] = value;
        }
      }
      if (b > 0) {
        for (let i = firstViewCopyLength - secondViewCopyLength + 1; i >= 0; i--, counter++) {
          value = firstViewCopy[firstViewCopyLength - counter] - b;
          if (value < 0) {
            b = 1;
            firstViewCopy[firstViewCopyLength - counter] = value + 10;
          } else {
            b = 0;
            firstViewCopy[firstViewCopyLength - counter] = value;
            break;
          }
        }
      }
      return firstViewCopy.slice();
    }
    var LocalIntegerValueBlock = class extends HexBlock(ValueBlock) {
      constructor({ value, ...parameters } = {}) {
        super(parameters);
        this._valueDec = 0;
        if (parameters.valueHex) {
          this.setValueHex();
        }
        if (value !== void 0) {
          this.valueDec = value;
        }
      }
      setValueHex() {
        if (this.valueHexView.length >= 4) {
          this.warnings.push("Too big Integer for decoding, hex only");
          this.isHexOnly = true;
          this._valueDec = 0;
        } else {
          this.isHexOnly = false;
          if (this.valueHexView.length > 0) {
            this._valueDec = pvutils__namespace.utilDecodeTC.call(this);
          }
        }
      }
      set valueDec(v) {
        this._valueDec = v;
        this.isHexOnly = false;
        this.valueHexView = new Uint8Array(pvutils__namespace.utilEncodeTC(v));
      }
      get valueDec() {
        return this._valueDec;
      }
      fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
        const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
        if (offset === -1)
          return offset;
        const view = this.valueHexView;
        if (view[0] === 0 && (view[1] & 128) !== 0) {
          this.valueHexView = view.subarray(1);
        } else {
          if (expectedLength !== 0) {
            if (view.length < expectedLength) {
              if (expectedLength - view.length > 1)
                expectedLength = view.length + 1;
              this.valueHexView = view.subarray(expectedLength - view.length);
            }
          }
        }
        return offset;
      }
      toDER(sizeOnly = false) {
        const view = this.valueHexView;
        switch (true) {
          case (view[0] & 128) !== 0:
            {
              const updatedView = new Uint8Array(this.valueHexView.length + 1);
              updatedView[0] = 0;
              updatedView.set(view, 1);
              this.valueHexView = updatedView;
            }
            break;
          case (view[0] === 0 && (view[1] & 128) === 0):
            {
              this.valueHexView = this.valueHexView.subarray(1);
            }
            break;
        }
        return this.toBER(sizeOnly);
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
        if (resultOffset === -1) {
          return resultOffset;
        }
        this.setValueHex();
        return resultOffset;
      }
      toBER(sizeOnly) {
        return sizeOnly ? new ArrayBuffer(this.valueHexView.length) : this.valueHexView.slice().buffer;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          valueDec: this.valueDec
        };
      }
      toString() {
        const firstBit = this.valueHexView.length * 8 - 1;
        let digits = new Uint8Array(this.valueHexView.length * 8 / 3);
        let bitNumber = 0;
        let currentByte;
        const asn1View = this.valueHexView;
        let result = "";
        let flag = false;
        for (let byteNumber = asn1View.byteLength - 1; byteNumber >= 0; byteNumber--) {
          currentByte = asn1View[byteNumber];
          for (let i = 0; i < 8; i++) {
            if ((currentByte & 1) === 1) {
              switch (bitNumber) {
                case firstBit:
                  digits = viewSub(power2(bitNumber), digits);
                  result = "-";
                  break;
                default:
                  digits = viewAdd(digits, power2(bitNumber));
              }
            }
            bitNumber++;
            currentByte >>= 1;
          }
        }
        for (let i = 0; i < digits.length; i++) {
          if (digits[i])
            flag = true;
          if (flag)
            result += digitsString.charAt(digits[i]);
        }
        if (flag === false)
          result += digitsString.charAt(0);
        return result;
      }
    };
    _a$p = LocalIntegerValueBlock;
    LocalIntegerValueBlock.NAME = "IntegerValueBlock";
    (() => {
      Object.defineProperty(_a$p.prototype, "valueHex", {
        set: function(v) {
          this.valueHexView = new Uint8Array(v);
          this.setValueHex();
        },
        get: function() {
          return this.valueHexView.slice().buffer;
        }
      });
    })();
    var _a$o;
    var Integer2 = class _Integer extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalIntegerValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 2;
      }
      toBigInt() {
        assertBigInt();
        return BigInt(this.valueBlock.toString());
      }
      static fromBigInt(value) {
        assertBigInt();
        const bigIntValue = BigInt(value);
        const writer = new ViewWriter();
        const hex = bigIntValue.toString(16).replace(/^-/, "");
        const view = new Uint8Array(pvtsutils__namespace.Convert.FromHex(hex));
        if (bigIntValue < 0) {
          const first = new Uint8Array(view.length + (view[0] & 128 ? 1 : 0));
          first[0] |= 128;
          const firstInt = BigInt(`0x${pvtsutils__namespace.Convert.ToHex(first)}`);
          const secondInt = firstInt + bigIntValue;
          const second = pvtsutils__namespace.BufferSourceConverter.toUint8Array(pvtsutils__namespace.Convert.FromHex(secondInt.toString(16)));
          second[0] |= 128;
          writer.write(second);
        } else {
          if (view[0] & 128) {
            writer.write(new Uint8Array([0]));
          }
          writer.write(view);
        }
        const res = new _Integer({
          valueHex: writer.final()
        });
        return res;
      }
      convertToDER() {
        const integer = new _Integer({ valueHex: this.valueBlock.valueHexView });
        integer.valueBlock.toDER();
        return integer;
      }
      convertFromDER() {
        return new _Integer({
          valueHex: this.valueBlock.valueHexView[0] === 0 ? this.valueBlock.valueHexView.subarray(1) : this.valueBlock.valueHexView
        });
      }
      onAsciiEncoding() {
        return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
      }
    };
    _a$o = Integer2;
    (() => {
      typeStore.Integer = _a$o;
    })();
    Integer2.NAME = "INTEGER";
    var _a$n;
    var Enumerated = class extends Integer2 {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 10;
      }
    };
    _a$n = Enumerated;
    (() => {
      typeStore.Enumerated = _a$n;
    })();
    Enumerated.NAME = "ENUMERATED";
    var LocalSidValueBlock = class extends HexBlock(ValueBlock) {
      constructor({ valueDec = -1, isFirstSid = false, ...parameters } = {}) {
        super(parameters);
        this.valueDec = valueDec;
        this.isFirstSid = isFirstSid;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        if (!inputLength) {
          return inputOffset;
        }
        const inputView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, inputView, inputOffset, inputLength)) {
          return -1;
        }
        const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
        this.valueHexView = new Uint8Array(inputLength);
        for (let i = 0; i < inputLength; i++) {
          this.valueHexView[i] = intBuffer[i] & 127;
          this.blockLength++;
          if ((intBuffer[i] & 128) === 0)
            break;
        }
        const tempView = new Uint8Array(this.blockLength);
        for (let i = 0; i < this.blockLength; i++) {
          tempView[i] = this.valueHexView[i];
        }
        this.valueHexView = tempView;
        if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
          this.error = "End of input reached before message was fully decoded";
          return -1;
        }
        if (this.valueHexView[0] === 0)
          this.warnings.push("Needlessly long format of SID encoding");
        if (this.blockLength <= 8)
          this.valueDec = pvutils__namespace.utilFromBase(this.valueHexView, 7);
        else {
          this.isHexOnly = true;
          this.warnings.push("Too big SID for decoding, hex only");
        }
        return inputOffset + this.blockLength;
      }
      set valueBigInt(value) {
        assertBigInt();
        let bits = BigInt(value).toString(2);
        while (bits.length % 7) {
          bits = "0" + bits;
        }
        const bytes2 = new Uint8Array(bits.length / 7);
        for (let i = 0; i < bytes2.length; i++) {
          bytes2[i] = parseInt(bits.slice(i * 7, i * 7 + 7), 2) + (i + 1 < bytes2.length ? 128 : 0);
        }
        this.fromBER(bytes2.buffer, 0, bytes2.length);
      }
      toBER(sizeOnly) {
        if (this.isHexOnly) {
          if (sizeOnly)
            return new ArrayBuffer(this.valueHexView.byteLength);
          const curView = this.valueHexView;
          const retView2 = new Uint8Array(this.blockLength);
          for (let i = 0; i < this.blockLength - 1; i++)
            retView2[i] = curView[i] | 128;
          retView2[this.blockLength - 1] = curView[this.blockLength - 1];
          return retView2.buffer;
        }
        const encodedBuf = pvutils__namespace.utilToBase(this.valueDec, 7);
        if (encodedBuf.byteLength === 0) {
          this.error = "Error during encoding SID value";
          return EMPTY_BUFFER;
        }
        const retView = new Uint8Array(encodedBuf.byteLength);
        if (!sizeOnly) {
          const encodedView = new Uint8Array(encodedBuf);
          const len = encodedBuf.byteLength - 1;
          for (let i = 0; i < len; i++)
            retView[i] = encodedView[i] | 128;
          retView[len] = encodedView[len];
        }
        return retView;
      }
      toString() {
        let result = "";
        if (this.isHexOnly)
          result = pvtsutils__namespace.Convert.ToHex(this.valueHexView);
        else {
          if (this.isFirstSid) {
            let sidValue = this.valueDec;
            if (this.valueDec <= 39)
              result = "0.";
            else {
              if (this.valueDec <= 79) {
                result = "1.";
                sidValue -= 40;
              } else {
                result = "2.";
                sidValue -= 80;
              }
            }
            result += sidValue.toString();
          } else
            result = this.valueDec.toString();
        }
        return result;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          valueDec: this.valueDec,
          isFirstSid: this.isFirstSid
        };
      }
    };
    LocalSidValueBlock.NAME = "sidBlock";
    var LocalObjectIdentifierValueBlock = class extends ValueBlock {
      constructor({ value = EMPTY_STRING, ...parameters } = {}) {
        super(parameters);
        this.value = [];
        if (value) {
          this.fromString(value);
        }
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        let resultOffset = inputOffset;
        while (inputLength > 0) {
          const sidBlock = new LocalSidValueBlock();
          resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
          if (resultOffset === -1) {
            this.blockLength = 0;
            this.error = sidBlock.error;
            return resultOffset;
          }
          if (this.value.length === 0)
            sidBlock.isFirstSid = true;
          this.blockLength += sidBlock.blockLength;
          inputLength -= sidBlock.blockLength;
          this.value.push(sidBlock);
        }
        return resultOffset;
      }
      toBER(sizeOnly) {
        const retBuffers = [];
        for (let i = 0; i < this.value.length; i++) {
          const valueBuf = this.value[i].toBER(sizeOnly);
          if (valueBuf.byteLength === 0) {
            this.error = this.value[i].error;
            return EMPTY_BUFFER;
          }
          retBuffers.push(valueBuf);
        }
        return concat2(retBuffers);
      }
      fromString(string2) {
        this.value = [];
        let pos1 = 0;
        let pos2 = 0;
        let sid = "";
        let flag = false;
        do {
          pos2 = string2.indexOf(".", pos1);
          if (pos2 === -1)
            sid = string2.substring(pos1);
          else
            sid = string2.substring(pos1, pos2);
          pos1 = pos2 + 1;
          if (flag) {
            const sidBlock = this.value[0];
            let plus = 0;
            switch (sidBlock.valueDec) {
              case 0:
                break;
              case 1:
                plus = 40;
                break;
              case 2:
                plus = 80;
                break;
              default:
                this.value = [];
                return;
            }
            const parsedSID = parseInt(sid, 10);
            if (isNaN(parsedSID))
              return;
            sidBlock.valueDec = parsedSID + plus;
            flag = false;
          } else {
            const sidBlock = new LocalSidValueBlock();
            if (sid > Number.MAX_SAFE_INTEGER) {
              assertBigInt();
              const sidValue = BigInt(sid);
              sidBlock.valueBigInt = sidValue;
            } else {
              sidBlock.valueDec = parseInt(sid, 10);
              if (isNaN(sidBlock.valueDec))
                return;
            }
            if (!this.value.length) {
              sidBlock.isFirstSid = true;
              flag = true;
            }
            this.value.push(sidBlock);
          }
        } while (pos2 !== -1);
      }
      toString() {
        let result = "";
        let isHexOnly = false;
        for (let i = 0; i < this.value.length; i++) {
          isHexOnly = this.value[i].isHexOnly;
          let sidStr = this.value[i].toString();
          if (i !== 0)
            result = `${result}.`;
          if (isHexOnly) {
            sidStr = `{${sidStr}}`;
            if (this.value[i].isFirstSid)
              result = `2.{${sidStr} - 80}`;
            else
              result += sidStr;
          } else
            result += sidStr;
        }
        return result;
      }
      toJSON() {
        const object = {
          ...super.toJSON(),
          value: this.toString(),
          sidArray: []
        };
        for (let i = 0; i < this.value.length; i++) {
          object.sidArray.push(this.value[i].toJSON());
        }
        return object;
      }
    };
    LocalObjectIdentifierValueBlock.NAME = "ObjectIdentifierValueBlock";
    var _a$m;
    var ObjectIdentifier2 = class extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalObjectIdentifierValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 6;
      }
      getValue() {
        return this.valueBlock.toString();
      }
      setValue(value) {
        this.valueBlock.fromString(value);
      }
      onAsciiEncoding() {
        return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          value: this.getValue()
        };
      }
    };
    _a$m = ObjectIdentifier2;
    (() => {
      typeStore.ObjectIdentifier = _a$m;
    })();
    ObjectIdentifier2.NAME = "OBJECT IDENTIFIER";
    var LocalRelativeSidValueBlock = class extends HexBlock(LocalBaseBlock) {
      constructor({ valueDec = 0, ...parameters } = {}) {
        super(parameters);
        this.valueDec = valueDec;
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        if (inputLength === 0)
          return inputOffset;
        const inputView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
        if (!checkBufferParams(this, inputView, inputOffset, inputLength))
          return -1;
        const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
        this.valueHexView = new Uint8Array(inputLength);
        for (let i = 0; i < inputLength; i++) {
          this.valueHexView[i] = intBuffer[i] & 127;
          this.blockLength++;
          if ((intBuffer[i] & 128) === 0)
            break;
        }
        const tempView = new Uint8Array(this.blockLength);
        for (let i = 0; i < this.blockLength; i++)
          tempView[i] = this.valueHexView[i];
        this.valueHexView = tempView;
        if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
          this.error = "End of input reached before message was fully decoded";
          return -1;
        }
        if (this.valueHexView[0] === 0)
          this.warnings.push("Needlessly long format of SID encoding");
        if (this.blockLength <= 8)
          this.valueDec = pvutils__namespace.utilFromBase(this.valueHexView, 7);
        else {
          this.isHexOnly = true;
          this.warnings.push("Too big SID for decoding, hex only");
        }
        return inputOffset + this.blockLength;
      }
      toBER(sizeOnly) {
        if (this.isHexOnly) {
          if (sizeOnly)
            return new ArrayBuffer(this.valueHexView.byteLength);
          const curView = this.valueHexView;
          const retView2 = new Uint8Array(this.blockLength);
          for (let i = 0; i < this.blockLength - 1; i++)
            retView2[i] = curView[i] | 128;
          retView2[this.blockLength - 1] = curView[this.blockLength - 1];
          return retView2.buffer;
        }
        const encodedBuf = pvutils__namespace.utilToBase(this.valueDec, 7);
        if (encodedBuf.byteLength === 0) {
          this.error = "Error during encoding SID value";
          return EMPTY_BUFFER;
        }
        const retView = new Uint8Array(encodedBuf.byteLength);
        if (!sizeOnly) {
          const encodedView = new Uint8Array(encodedBuf);
          const len = encodedBuf.byteLength - 1;
          for (let i = 0; i < len; i++)
            retView[i] = encodedView[i] | 128;
          retView[len] = encodedView[len];
        }
        return retView.buffer;
      }
      toString() {
        let result = "";
        if (this.isHexOnly)
          result = pvtsutils__namespace.Convert.ToHex(this.valueHexView);
        else {
          result = this.valueDec.toString();
        }
        return result;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          valueDec: this.valueDec
        };
      }
    };
    LocalRelativeSidValueBlock.NAME = "relativeSidBlock";
    var LocalRelativeObjectIdentifierValueBlock = class extends ValueBlock {
      constructor({ value = EMPTY_STRING, ...parameters } = {}) {
        super(parameters);
        this.value = [];
        if (value) {
          this.fromString(value);
        }
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        let resultOffset = inputOffset;
        while (inputLength > 0) {
          const sidBlock = new LocalRelativeSidValueBlock();
          resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
          if (resultOffset === -1) {
            this.blockLength = 0;
            this.error = sidBlock.error;
            return resultOffset;
          }
          this.blockLength += sidBlock.blockLength;
          inputLength -= sidBlock.blockLength;
          this.value.push(sidBlock);
        }
        return resultOffset;
      }
      toBER(sizeOnly, writer) {
        const retBuffers = [];
        for (let i = 0; i < this.value.length; i++) {
          const valueBuf = this.value[i].toBER(sizeOnly);
          if (valueBuf.byteLength === 0) {
            this.error = this.value[i].error;
            return EMPTY_BUFFER;
          }
          retBuffers.push(valueBuf);
        }
        return concat2(retBuffers);
      }
      fromString(string2) {
        this.value = [];
        let pos1 = 0;
        let pos2 = 0;
        let sid = "";
        do {
          pos2 = string2.indexOf(".", pos1);
          if (pos2 === -1)
            sid = string2.substring(pos1);
          else
            sid = string2.substring(pos1, pos2);
          pos1 = pos2 + 1;
          const sidBlock = new LocalRelativeSidValueBlock();
          sidBlock.valueDec = parseInt(sid, 10);
          if (isNaN(sidBlock.valueDec))
            return true;
          this.value.push(sidBlock);
        } while (pos2 !== -1);
        return true;
      }
      toString() {
        let result = "";
        let isHexOnly = false;
        for (let i = 0; i < this.value.length; i++) {
          isHexOnly = this.value[i].isHexOnly;
          let sidStr = this.value[i].toString();
          if (i !== 0)
            result = `${result}.`;
          if (isHexOnly) {
            sidStr = `{${sidStr}}`;
            result += sidStr;
          } else
            result += sidStr;
        }
        return result;
      }
      toJSON() {
        const object = {
          ...super.toJSON(),
          value: this.toString(),
          sidArray: []
        };
        for (let i = 0; i < this.value.length; i++)
          object.sidArray.push(this.value[i].toJSON());
        return object;
      }
    };
    LocalRelativeObjectIdentifierValueBlock.NAME = "RelativeObjectIdentifierValueBlock";
    var _a$l;
    var RelativeObjectIdentifier = class extends BaseBlock {
      constructor(parameters = {}) {
        super(parameters, LocalRelativeObjectIdentifierValueBlock);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 13;
      }
      getValue() {
        return this.valueBlock.toString();
      }
      setValue(value) {
        this.valueBlock.fromString(value);
      }
      onAsciiEncoding() {
        return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          value: this.getValue()
        };
      }
    };
    _a$l = RelativeObjectIdentifier;
    (() => {
      typeStore.RelativeObjectIdentifier = _a$l;
    })();
    RelativeObjectIdentifier.NAME = "RelativeObjectIdentifier";
    var _a$k;
    var Sequence2 = class extends Constructed {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 16;
      }
    };
    _a$k = Sequence2;
    (() => {
      typeStore.Sequence = _a$k;
    })();
    Sequence2.NAME = "SEQUENCE";
    var _a$j;
    var Set = class extends Constructed {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 17;
      }
    };
    _a$j = Set;
    (() => {
      typeStore.Set = _a$j;
    })();
    Set.NAME = "SET";
    var LocalStringValueBlock = class extends HexBlock(ValueBlock) {
      constructor({ ...parameters } = {}) {
        super(parameters);
        this.isHexOnly = true;
        this.value = EMPTY_STRING;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          value: this.value
        };
      }
    };
    LocalStringValueBlock.NAME = "StringValueBlock";
    var LocalSimpleStringValueBlock = class extends LocalStringValueBlock {
    };
    LocalSimpleStringValueBlock.NAME = "SimpleStringValueBlock";
    var LocalSimpleStringBlock = class extends BaseStringBlock {
      constructor({ ...parameters } = {}) {
        super(parameters, LocalSimpleStringValueBlock);
      }
      fromBuffer(inputBuffer) {
        this.valueBlock.value = String.fromCharCode.apply(null, pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer));
      }
      fromString(inputString) {
        const strLen = inputString.length;
        const view = this.valueBlock.valueHexView = new Uint8Array(strLen);
        for (let i = 0; i < strLen; i++)
          view[i] = inputString.charCodeAt(i);
        this.valueBlock.value = inputString;
      }
    };
    LocalSimpleStringBlock.NAME = "SIMPLE STRING";
    var LocalUtf8StringValueBlock = class extends LocalSimpleStringBlock {
      fromBuffer(inputBuffer) {
        this.valueBlock.valueHexView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
        try {
          this.valueBlock.value = pvtsutils__namespace.Convert.ToUtf8String(inputBuffer);
        } catch (ex) {
          this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
          this.valueBlock.value = pvtsutils__namespace.Convert.ToBinary(inputBuffer);
        }
      }
      fromString(inputString) {
        this.valueBlock.valueHexView = new Uint8Array(pvtsutils__namespace.Convert.FromUtf8String(inputString));
        this.valueBlock.value = inputString;
      }
    };
    LocalUtf8StringValueBlock.NAME = "Utf8StringValueBlock";
    var _a$i;
    var Utf8String = class extends LocalUtf8StringValueBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 12;
      }
    };
    _a$i = Utf8String;
    (() => {
      typeStore.Utf8String = _a$i;
    })();
    Utf8String.NAME = "UTF8String";
    var LocalBmpStringValueBlock = class extends LocalSimpleStringBlock {
      fromBuffer(inputBuffer) {
        this.valueBlock.value = pvtsutils__namespace.Convert.ToUtf16String(inputBuffer);
        this.valueBlock.valueHexView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
      }
      fromString(inputString) {
        this.valueBlock.value = inputString;
        this.valueBlock.valueHexView = new Uint8Array(pvtsutils__namespace.Convert.FromUtf16String(inputString));
      }
    };
    LocalBmpStringValueBlock.NAME = "BmpStringValueBlock";
    var _a$h;
    var BmpString = class extends LocalBmpStringValueBlock {
      constructor({ ...parameters } = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 30;
      }
    };
    _a$h = BmpString;
    (() => {
      typeStore.BmpString = _a$h;
    })();
    BmpString.NAME = "BMPString";
    var LocalUniversalStringValueBlock = class extends LocalSimpleStringBlock {
      fromBuffer(inputBuffer) {
        const copyBuffer = ArrayBuffer.isView(inputBuffer) ? inputBuffer.slice().buffer : inputBuffer.slice(0);
        const valueView = new Uint8Array(copyBuffer);
        for (let i = 0; i < valueView.length; i += 4) {
          valueView[i] = valueView[i + 3];
          valueView[i + 1] = valueView[i + 2];
          valueView[i + 2] = 0;
          valueView[i + 3] = 0;
        }
        this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
      }
      fromString(inputString) {
        const strLength = inputString.length;
        const valueHexView = this.valueBlock.valueHexView = new Uint8Array(strLength * 4);
        for (let i = 0; i < strLength; i++) {
          const codeBuf = pvutils__namespace.utilToBase(inputString.charCodeAt(i), 8);
          const codeView = new Uint8Array(codeBuf);
          if (codeView.length > 4)
            continue;
          const dif = 4 - codeView.length;
          for (let j = codeView.length - 1; j >= 0; j--)
            valueHexView[i * 4 + j + dif] = codeView[j];
        }
        this.valueBlock.value = inputString;
      }
    };
    LocalUniversalStringValueBlock.NAME = "UniversalStringValueBlock";
    var _a$g;
    var UniversalString = class extends LocalUniversalStringValueBlock {
      constructor({ ...parameters } = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 28;
      }
    };
    _a$g = UniversalString;
    (() => {
      typeStore.UniversalString = _a$g;
    })();
    UniversalString.NAME = "UniversalString";
    var _a$f;
    var NumericString = class extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 18;
      }
    };
    _a$f = NumericString;
    (() => {
      typeStore.NumericString = _a$f;
    })();
    NumericString.NAME = "NumericString";
    var _a$e;
    var PrintableString = class extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 19;
      }
    };
    _a$e = PrintableString;
    (() => {
      typeStore.PrintableString = _a$e;
    })();
    PrintableString.NAME = "PrintableString";
    var _a$d;
    var TeletexString = class extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 20;
      }
    };
    _a$d = TeletexString;
    (() => {
      typeStore.TeletexString = _a$d;
    })();
    TeletexString.NAME = "TeletexString";
    var _a$c;
    var VideotexString = class extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 21;
      }
    };
    _a$c = VideotexString;
    (() => {
      typeStore.VideotexString = _a$c;
    })();
    VideotexString.NAME = "VideotexString";
    var _a$b;
    var IA5String = class extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 22;
      }
    };
    _a$b = IA5String;
    (() => {
      typeStore.IA5String = _a$b;
    })();
    IA5String.NAME = "IA5String";
    var _a$a;
    var GraphicString = class extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 25;
      }
    };
    _a$a = GraphicString;
    (() => {
      typeStore.GraphicString = _a$a;
    })();
    GraphicString.NAME = "GraphicString";
    var _a$9;
    var VisibleString = class extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 26;
      }
    };
    _a$9 = VisibleString;
    (() => {
      typeStore.VisibleString = _a$9;
    })();
    VisibleString.NAME = "VisibleString";
    var _a$8;
    var GeneralString = class extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 27;
      }
    };
    _a$8 = GeneralString;
    (() => {
      typeStore.GeneralString = _a$8;
    })();
    GeneralString.NAME = "GeneralString";
    var _a$7;
    var CharacterString = class extends LocalSimpleStringBlock {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 29;
      }
    };
    _a$7 = CharacterString;
    (() => {
      typeStore.CharacterString = _a$7;
    })();
    CharacterString.NAME = "CharacterString";
    var _a$6;
    var UTCTime = class extends VisibleString {
      constructor({ value, valueDate, ...parameters } = {}) {
        super(parameters);
        this.year = 0;
        this.month = 0;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        if (value) {
          this.fromString(value);
          this.valueBlock.valueHexView = new Uint8Array(value.length);
          for (let i = 0; i < value.length; i++)
            this.valueBlock.valueHexView[i] = value.charCodeAt(i);
        }
        if (valueDate) {
          this.fromDate(valueDate);
          this.valueBlock.valueHexView = new Uint8Array(this.toBuffer());
        }
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 23;
      }
      fromBuffer(inputBuffer) {
        this.fromString(String.fromCharCode.apply(null, pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer)));
      }
      toBuffer() {
        const str = this.toString();
        const buffer = new ArrayBuffer(str.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < str.length; i++)
          view[i] = str.charCodeAt(i);
        return buffer;
      }
      fromDate(inputDate) {
        this.year = inputDate.getUTCFullYear();
        this.month = inputDate.getUTCMonth() + 1;
        this.day = inputDate.getUTCDate();
        this.hour = inputDate.getUTCHours();
        this.minute = inputDate.getUTCMinutes();
        this.second = inputDate.getUTCSeconds();
      }
      toDate() {
        return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
      }
      fromString(inputString) {
        const parser = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/ig;
        const parserArray = parser.exec(inputString);
        if (parserArray === null) {
          this.error = "Wrong input string for conversion";
          return;
        }
        const year = parseInt(parserArray[1], 10);
        if (year >= 50)
          this.year = 1900 + year;
        else
          this.year = 2e3 + year;
        this.month = parseInt(parserArray[2], 10);
        this.day = parseInt(parserArray[3], 10);
        this.hour = parseInt(parserArray[4], 10);
        this.minute = parseInt(parserArray[5], 10);
        this.second = parseInt(parserArray[6], 10);
      }
      toString(encoding = "iso") {
        if (encoding === "iso") {
          const outputArray = new Array(7);
          outputArray[0] = pvutils__namespace.padNumber(this.year < 2e3 ? this.year - 1900 : this.year - 2e3, 2);
          outputArray[1] = pvutils__namespace.padNumber(this.month, 2);
          outputArray[2] = pvutils__namespace.padNumber(this.day, 2);
          outputArray[3] = pvutils__namespace.padNumber(this.hour, 2);
          outputArray[4] = pvutils__namespace.padNumber(this.minute, 2);
          outputArray[5] = pvutils__namespace.padNumber(this.second, 2);
          outputArray[6] = "Z";
          return outputArray.join("");
        }
        return super.toString(encoding);
      }
      onAsciiEncoding() {
        return `${this.constructor.NAME} : ${this.toDate().toISOString()}`;
      }
      toJSON() {
        return {
          ...super.toJSON(),
          year: this.year,
          month: this.month,
          day: this.day,
          hour: this.hour,
          minute: this.minute,
          second: this.second
        };
      }
    };
    _a$6 = UTCTime;
    (() => {
      typeStore.UTCTime = _a$6;
    })();
    UTCTime.NAME = "UTCTime";
    var _a$5;
    var GeneralizedTime = class extends UTCTime {
      constructor(parameters = {}) {
        var _b;
        super(parameters);
        (_b = this.millisecond) !== null && _b !== void 0 ? _b : this.millisecond = 0;
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 24;
      }
      fromDate(inputDate) {
        super.fromDate(inputDate);
        this.millisecond = inputDate.getUTCMilliseconds();
      }
      toDate() {
        return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond));
      }
      fromString(inputString) {
        let isUTC = false;
        let timeString = "";
        let dateTimeString = "";
        let fractionPart = 0;
        let parser;
        let hourDifference = 0;
        let minuteDifference = 0;
        if (inputString[inputString.length - 1] === "Z") {
          timeString = inputString.substring(0, inputString.length - 1);
          isUTC = true;
        } else {
          const number2 = new Number(inputString[inputString.length - 1]);
          if (isNaN(number2.valueOf()))
            throw new Error("Wrong input string for conversion");
          timeString = inputString;
        }
        if (isUTC) {
          if (timeString.indexOf("+") !== -1)
            throw new Error("Wrong input string for conversion");
          if (timeString.indexOf("-") !== -1)
            throw new Error("Wrong input string for conversion");
        } else {
          let multiplier = 1;
          let differencePosition = timeString.indexOf("+");
          let differenceString = "";
          if (differencePosition === -1) {
            differencePosition = timeString.indexOf("-");
            multiplier = -1;
          }
          if (differencePosition !== -1) {
            differenceString = timeString.substring(differencePosition + 1);
            timeString = timeString.substring(0, differencePosition);
            if (differenceString.length !== 2 && differenceString.length !== 4)
              throw new Error("Wrong input string for conversion");
            let number2 = parseInt(differenceString.substring(0, 2), 10);
            if (isNaN(number2.valueOf()))
              throw new Error("Wrong input string for conversion");
            hourDifference = multiplier * number2;
            if (differenceString.length === 4) {
              number2 = parseInt(differenceString.substring(2, 4), 10);
              if (isNaN(number2.valueOf()))
                throw new Error("Wrong input string for conversion");
              minuteDifference = multiplier * number2;
            }
          }
        }
        let fractionPointPosition = timeString.indexOf(".");
        if (fractionPointPosition === -1)
          fractionPointPosition = timeString.indexOf(",");
        if (fractionPointPosition !== -1) {
          const fractionPartCheck = new Number(`0${timeString.substring(fractionPointPosition)}`);
          if (isNaN(fractionPartCheck.valueOf()))
            throw new Error("Wrong input string for conversion");
          fractionPart = fractionPartCheck.valueOf();
          dateTimeString = timeString.substring(0, fractionPointPosition);
        } else
          dateTimeString = timeString;
        switch (true) {
          case dateTimeString.length === 8:
            parser = /(\d{4})(\d{2})(\d{2})/ig;
            if (fractionPointPosition !== -1)
              throw new Error("Wrong input string for conversion");
            break;
          case dateTimeString.length === 10:
            parser = /(\d{4})(\d{2})(\d{2})(\d{2})/ig;
            if (fractionPointPosition !== -1) {
              let fractionResult = 60 * fractionPart;
              this.minute = Math.floor(fractionResult);
              fractionResult = 60 * (fractionResult - this.minute);
              this.second = Math.floor(fractionResult);
              fractionResult = 1e3 * (fractionResult - this.second);
              this.millisecond = Math.floor(fractionResult);
            }
            break;
          case dateTimeString.length === 12:
            parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/ig;
            if (fractionPointPosition !== -1) {
              let fractionResult = 60 * fractionPart;
              this.second = Math.floor(fractionResult);
              fractionResult = 1e3 * (fractionResult - this.second);
              this.millisecond = Math.floor(fractionResult);
            }
            break;
          case dateTimeString.length === 14:
            parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/ig;
            if (fractionPointPosition !== -1) {
              const fractionResult = 1e3 * fractionPart;
              this.millisecond = Math.floor(fractionResult);
            }
            break;
          default:
            throw new Error("Wrong input string for conversion");
        }
        const parserArray = parser.exec(dateTimeString);
        if (parserArray === null)
          throw new Error("Wrong input string for conversion");
        for (let j = 1; j < parserArray.length; j++) {
          switch (j) {
            case 1:
              this.year = parseInt(parserArray[j], 10);
              break;
            case 2:
              this.month = parseInt(parserArray[j], 10);
              break;
            case 3:
              this.day = parseInt(parserArray[j], 10);
              break;
            case 4:
              this.hour = parseInt(parserArray[j], 10) + hourDifference;
              break;
            case 5:
              this.minute = parseInt(parserArray[j], 10) + minuteDifference;
              break;
            case 6:
              this.second = parseInt(parserArray[j], 10);
              break;
            default:
              throw new Error("Wrong input string for conversion");
          }
        }
        if (isUTC === false) {
          const tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
          this.year = tempDate.getUTCFullYear();
          this.month = tempDate.getUTCMonth();
          this.day = tempDate.getUTCDay();
          this.hour = tempDate.getUTCHours();
          this.minute = tempDate.getUTCMinutes();
          this.second = tempDate.getUTCSeconds();
          this.millisecond = tempDate.getUTCMilliseconds();
        }
      }
      toString(encoding = "iso") {
        if (encoding === "iso") {
          const outputArray = [];
          outputArray.push(pvutils__namespace.padNumber(this.year, 4));
          outputArray.push(pvutils__namespace.padNumber(this.month, 2));
          outputArray.push(pvutils__namespace.padNumber(this.day, 2));
          outputArray.push(pvutils__namespace.padNumber(this.hour, 2));
          outputArray.push(pvutils__namespace.padNumber(this.minute, 2));
          outputArray.push(pvutils__namespace.padNumber(this.second, 2));
          if (this.millisecond !== 0) {
            outputArray.push(".");
            outputArray.push(pvutils__namespace.padNumber(this.millisecond, 3));
          }
          outputArray.push("Z");
          return outputArray.join("");
        }
        return super.toString(encoding);
      }
      toJSON() {
        return {
          ...super.toJSON(),
          millisecond: this.millisecond
        };
      }
    };
    _a$5 = GeneralizedTime;
    (() => {
      typeStore.GeneralizedTime = _a$5;
    })();
    GeneralizedTime.NAME = "GeneralizedTime";
    var _a$4;
    var DATE = class extends Utf8String {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 31;
      }
    };
    _a$4 = DATE;
    (() => {
      typeStore.DATE = _a$4;
    })();
    DATE.NAME = "DATE";
    var _a$3;
    var TimeOfDay = class extends Utf8String {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 32;
      }
    };
    _a$3 = TimeOfDay;
    (() => {
      typeStore.TimeOfDay = _a$3;
    })();
    TimeOfDay.NAME = "TimeOfDay";
    var _a$2;
    var DateTime = class extends Utf8String {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 33;
      }
    };
    _a$2 = DateTime;
    (() => {
      typeStore.DateTime = _a$2;
    })();
    DateTime.NAME = "DateTime";
    var _a$1;
    var Duration = class extends Utf8String {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 34;
      }
    };
    _a$1 = Duration;
    (() => {
      typeStore.Duration = _a$1;
    })();
    Duration.NAME = "Duration";
    var _a;
    var TIME = class extends Utf8String {
      constructor(parameters = {}) {
        super(parameters);
        this.idBlock.tagClass = 1;
        this.idBlock.tagNumber = 14;
      }
    };
    _a = TIME;
    (() => {
      typeStore.TIME = _a;
    })();
    TIME.NAME = "TIME";
    var Any = class {
      constructor({ name: name2 = EMPTY_STRING, optional = false } = {}) {
        this.name = name2;
        this.optional = optional;
      }
    };
    var Choice = class extends Any {
      constructor({ value = [], ...parameters } = {}) {
        super(parameters);
        this.value = value;
      }
    };
    var Repeated = class extends Any {
      constructor({ value = new Any(), local = false, ...parameters } = {}) {
        super(parameters);
        this.value = value;
        this.local = local;
      }
    };
    var RawData = class {
      constructor({ data = EMPTY_VIEW } = {}) {
        this.dataView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(data);
      }
      get data() {
        return this.dataView.slice().buffer;
      }
      set data(value) {
        this.dataView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(value);
      }
      fromBER(inputBuffer, inputOffset, inputLength) {
        const endLength = inputOffset + inputLength;
        this.dataView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer).subarray(inputOffset, endLength);
        return endLength;
      }
      toBER(sizeOnly) {
        return this.dataView.slice().buffer;
      }
    };
    function compareSchema(root, inputData, inputSchema) {
      if (inputSchema instanceof Choice) {
        for (let j = 0; j < inputSchema.value.length; j++) {
          const result = compareSchema(root, inputData, inputSchema.value[j]);
          if (result.verified) {
            return {
              verified: true,
              result: root
            };
          }
        }
        {
          const _result = {
            verified: false,
            result: {
              error: "Wrong values for Choice type"
            }
          };
          if (inputSchema.hasOwnProperty(NAME))
            _result.name = inputSchema.name;
          return _result;
        }
      }
      if (inputSchema instanceof Any) {
        if (inputSchema.hasOwnProperty(NAME))
          root[inputSchema.name] = inputData;
        return {
          verified: true,
          result: root
        };
      }
      if (root instanceof Object === false) {
        return {
          verified: false,
          result: { error: "Wrong root object" }
        };
      }
      if (inputData instanceof Object === false) {
        return {
          verified: false,
          result: { error: "Wrong ASN.1 data" }
        };
      }
      if (inputSchema instanceof Object === false) {
        return {
          verified: false,
          result: { error: "Wrong ASN.1 schema" }
        };
      }
      if (ID_BLOCK in inputSchema === false) {
        return {
          verified: false,
          result: { error: "Wrong ASN.1 schema" }
        };
      }
      if (FROM_BER in inputSchema.idBlock === false) {
        return {
          verified: false,
          result: { error: "Wrong ASN.1 schema" }
        };
      }
      if (TO_BER in inputSchema.idBlock === false) {
        return {
          verified: false,
          result: { error: "Wrong ASN.1 schema" }
        };
      }
      const encodedId = inputSchema.idBlock.toBER(false);
      if (encodedId.byteLength === 0) {
        return {
          verified: false,
          result: { error: "Error encoding idBlock for ASN.1 schema" }
        };
      }
      const decodedOffset = inputSchema.idBlock.fromBER(encodedId, 0, encodedId.byteLength);
      if (decodedOffset === -1) {
        return {
          verified: false,
          result: { error: "Error decoding idBlock for ASN.1 schema" }
        };
      }
      if (inputSchema.idBlock.hasOwnProperty(TAG_CLASS) === false) {
        return {
          verified: false,
          result: { error: "Wrong ASN.1 schema" }
        };
      }
      if (inputSchema.idBlock.tagClass !== inputData.idBlock.tagClass) {
        return {
          verified: false,
          result: root
        };
      }
      if (inputSchema.idBlock.hasOwnProperty(TAG_NUMBER) === false) {
        return {
          verified: false,
          result: { error: "Wrong ASN.1 schema" }
        };
      }
      if (inputSchema.idBlock.tagNumber !== inputData.idBlock.tagNumber) {
        return {
          verified: false,
          result: root
        };
      }
      if (inputSchema.idBlock.hasOwnProperty(IS_CONSTRUCTED) === false) {
        return {
          verified: false,
          result: { error: "Wrong ASN.1 schema" }
        };
      }
      if (inputSchema.idBlock.isConstructed !== inputData.idBlock.isConstructed) {
        return {
          verified: false,
          result: root
        };
      }
      if (!(IS_HEX_ONLY in inputSchema.idBlock)) {
        return {
          verified: false,
          result: { error: "Wrong ASN.1 schema" }
        };
      }
      if (inputSchema.idBlock.isHexOnly !== inputData.idBlock.isHexOnly) {
        return {
          verified: false,
          result: root
        };
      }
      if (inputSchema.idBlock.isHexOnly) {
        if (VALUE_HEX_VIEW in inputSchema.idBlock === false) {
          return {
            verified: false,
            result: { error: "Wrong ASN.1 schema" }
          };
        }
        const schemaView = inputSchema.idBlock.valueHexView;
        const asn1View = inputData.idBlock.valueHexView;
        if (schemaView.length !== asn1View.length) {
          return {
            verified: false,
            result: root
          };
        }
        for (let i = 0; i < schemaView.length; i++) {
          if (schemaView[i] !== asn1View[1]) {
            return {
              verified: false,
              result: root
            };
          }
        }
      }
      if (inputSchema.name) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
        if (inputSchema.name)
          root[inputSchema.name] = inputData;
      }
      if (inputSchema instanceof typeStore.Constructed) {
        let admission = 0;
        let result = {
          verified: false,
          result: {
            error: "Unknown error"
          }
        };
        let maxLength = inputSchema.valueBlock.value.length;
        if (maxLength > 0) {
          if (inputSchema.valueBlock.value[0] instanceof Repeated) {
            maxLength = inputData.valueBlock.value.length;
          }
        }
        if (maxLength === 0) {
          return {
            verified: true,
            result: root
          };
        }
        if (inputData.valueBlock.value.length === 0 && inputSchema.valueBlock.value.length !== 0) {
          let _optional = true;
          for (let i = 0; i < inputSchema.valueBlock.value.length; i++)
            _optional = _optional && (inputSchema.valueBlock.value[i].optional || false);
          if (_optional) {
            return {
              verified: true,
              result: root
            };
          }
          if (inputSchema.name) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
            if (inputSchema.name)
              delete root[inputSchema.name];
          }
          root.error = "Inconsistent object length";
          return {
            verified: false,
            result: root
          };
        }
        for (let i = 0; i < maxLength; i++) {
          if (i - admission >= inputData.valueBlock.value.length) {
            if (inputSchema.valueBlock.value[i].optional === false) {
              const _result = {
                verified: false,
                result: root
              };
              root.error = "Inconsistent length between ASN.1 data and schema";
              if (inputSchema.name) {
                inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                if (inputSchema.name) {
                  delete root[inputSchema.name];
                  _result.name = inputSchema.name;
                }
              }
              return _result;
            }
          } else {
            if (inputSchema.valueBlock.value[0] instanceof Repeated) {
              result = compareSchema(root, inputData.valueBlock.value[i], inputSchema.valueBlock.value[0].value);
              if (result.verified === false) {
                if (inputSchema.valueBlock.value[0].optional)
                  admission++;
                else {
                  if (inputSchema.name) {
                    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                    if (inputSchema.name)
                      delete root[inputSchema.name];
                  }
                  return result;
                }
              }
              if (NAME in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].name.length > 0) {
                let arrayRoot = {};
                if (LOCAL in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].local)
                  arrayRoot = inputData;
                else
                  arrayRoot = root;
                if (typeof arrayRoot[inputSchema.valueBlock.value[0].name] === "undefined")
                  arrayRoot[inputSchema.valueBlock.value[0].name] = [];
                arrayRoot[inputSchema.valueBlock.value[0].name].push(inputData.valueBlock.value[i]);
              }
            } else {
              result = compareSchema(root, inputData.valueBlock.value[i - admission], inputSchema.valueBlock.value[i]);
              if (result.verified === false) {
                if (inputSchema.valueBlock.value[i].optional)
                  admission++;
                else {
                  if (inputSchema.name) {
                    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
                    if (inputSchema.name)
                      delete root[inputSchema.name];
                  }
                  return result;
                }
              }
            }
          }
        }
        if (result.verified === false) {
          const _result = {
            verified: false,
            result: root
          };
          if (inputSchema.name) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
            if (inputSchema.name) {
              delete root[inputSchema.name];
              _result.name = inputSchema.name;
            }
          }
          return _result;
        }
        return {
          verified: true,
          result: root
        };
      }
      if (inputSchema.primitiveSchema && VALUE_HEX_VIEW in inputData.valueBlock) {
        const asn1 = localFromBER(inputData.valueBlock.valueHexView);
        if (asn1.offset === -1) {
          const _result = {
            verified: false,
            result: asn1.result
          };
          if (inputSchema.name) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
            if (inputSchema.name) {
              delete root[inputSchema.name];
              _result.name = inputSchema.name;
            }
          }
          return _result;
        }
        return compareSchema(root, asn1.result, inputSchema.primitiveSchema);
      }
      return {
        verified: true,
        result: root
      };
    }
    function verifySchema(inputBuffer, inputSchema) {
      if (inputSchema instanceof Object === false) {
        return {
          verified: false,
          result: { error: "Wrong ASN.1 schema type" }
        };
      }
      const asn1 = localFromBER(pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer));
      if (asn1.offset === -1) {
        return {
          verified: false,
          result: asn1.result
        };
      }
      return compareSchema(asn1.result, asn1.result, inputSchema);
    }
    exports.Any = Any;
    exports.BaseBlock = BaseBlock;
    exports.BaseStringBlock = BaseStringBlock;
    exports.BitString = BitString2;
    exports.BmpString = BmpString;
    exports.Boolean = Boolean2;
    exports.CharacterString = CharacterString;
    exports.Choice = Choice;
    exports.Constructed = Constructed;
    exports.DATE = DATE;
    exports.DateTime = DateTime;
    exports.Duration = Duration;
    exports.EndOfContent = EndOfContent;
    exports.Enumerated = Enumerated;
    exports.GeneralString = GeneralString;
    exports.GeneralizedTime = GeneralizedTime;
    exports.GraphicString = GraphicString;
    exports.HexBlock = HexBlock;
    exports.IA5String = IA5String;
    exports.Integer = Integer2;
    exports.Null = Null2;
    exports.NumericString = NumericString;
    exports.ObjectIdentifier = ObjectIdentifier2;
    exports.OctetString = OctetString2;
    exports.Primitive = Primitive;
    exports.PrintableString = PrintableString;
    exports.RawData = RawData;
    exports.RelativeObjectIdentifier = RelativeObjectIdentifier;
    exports.Repeated = Repeated;
    exports.Sequence = Sequence2;
    exports.Set = Set;
    exports.TIME = TIME;
    exports.TeletexString = TeletexString;
    exports.TimeOfDay = TimeOfDay;
    exports.UTCTime = UTCTime;
    exports.UniversalString = UniversalString;
    exports.Utf8String = Utf8String;
    exports.ValueBlock = ValueBlock;
    exports.VideotexString = VideotexString;
    exports.ViewWriter = ViewWriter;
    exports.VisibleString = VisibleString;
    exports.compareSchema = compareSchema;
    exports.fromBER = fromBER2;
    exports.verifySchema = verifySchema;
  }
});

// node_modules/@libp2p/crypto/dist/src/keys/index.js
var keys_exports2 = {};
__export(keys_exports2, {
  Ed25519PrivateKey: () => Ed25519PrivateKey,
  Ed25519PublicKey: () => Ed25519PublicKey,
  MAX_RSA_KEY_SIZE: () => MAX_RSA_KEY_SIZE,
  RsaPrivateKey: () => RsaPrivateKey,
  RsaPublicKey: () => RsaPublicKey,
  Secp256k1PrivateKey: () => Secp256k1PrivateKey,
  Secp256k1PublicKey: () => Secp256k1PublicKey,
  generateEphemeralKeyPair: () => ephemeral_keys_default,
  generateKeyPair: () => generateKeyPair4,
  generateKeyPairFromSeed: () => generateKeyPairFromSeed2,
  importKey: () => importKey,
  keyStretcher: () => keyStretcher,
  keysPBM: () => keys_exports,
  marshalPrivateKey: () => marshalPrivateKey,
  marshalPublicKey: () => marshalPublicKey,
  supportedKeys: () => supportedKeys,
  unmarshalPrivateKey: () => unmarshalPrivateKey2,
  unmarshalPublicKey: () => unmarshalPublicKey
});

// node_modules/@libp2p/interface/dist/src/peer-id/index.js
var peerIdSymbol = Symbol.for("@libp2p/peer-id");

// node_modules/@libp2p/interface/dist/src/errors.js
var CodeError = class extends Error {
  code;
  props;
  constructor(message2, code2, props) {
    super(message2);
    this.code = code2;
    this.name = props?.name ?? "CodeError";
    this.props = props ?? {};
  }
};

// node_modules/@libp2p/crypto/dist/src/keys/ed25519-class.js
var ed25519_class_exports = {};
__export(ed25519_class_exports, {
  Ed25519PrivateKey: () => Ed25519PrivateKey,
  Ed25519PublicKey: () => Ed25519PublicKey,
  generateKeyPair: () => generateKeyPair,
  generateKeyPairFromSeed: () => generateKeyPairFromSeed,
  unmarshalEd25519PrivateKey: () => unmarshalEd25519PrivateKey,
  unmarshalEd25519PublicKey: () => unmarshalEd25519PublicKey
});

// node_modules/multiformats/dist/src/bases/base58.js
var base58_exports = {};
__export(base58_exports, {
  base58btc: () => base58btc,
  base58flickr: () => base58flickr
});

// node_modules/multiformats/dist/src/bytes.js
var empty = new Uint8Array(0);
function equals(aa, bb) {
  if (aa === bb)
    return true;
  if (aa.byteLength !== bb.byteLength) {
    return false;
  }
  for (let ii = 0; ii < aa.byteLength; ii++) {
    if (aa[ii] !== bb[ii]) {
      return false;
    }
  }
  return true;
}
function coerce(o) {
  if (o instanceof Uint8Array && o.constructor.name === "Uint8Array")
    return o;
  if (o instanceof ArrayBuffer)
    return new Uint8Array(o);
  if (ArrayBuffer.isView(o)) {
    return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}
function fromString(str) {
  return new TextEncoder().encode(str);
}
function toString(b) {
  return new TextDecoder().decode(b);
}

// node_modules/multiformats/dist/src/vendor/base-x.js
function base(ALPHABET, name2) {
  if (ALPHABET.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    BASE_MAP[xc] = i;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode5(source) {
    if (source instanceof Uint8Array)
      ;
    else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length3 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i2 = 0;
      for (var it1 = size - 1; (carry !== 0 || i2 < length3) && it1 !== -1; it1--, i2++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length3 = i2;
      pbegin++;
    }
    var it2 = size - length3;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length3 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i2 = 0;
      for (var it3 = size - 1; (carry !== 0 || i2 < length3) && it3 !== -1; it3--, i2++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length3 = i2;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length3;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode6(string2) {
    var buffer = decodeUnsafe(string2);
    if (buffer) {
      return buffer;
    }
    throw new Error(`Non-${name2} character`);
  }
  return {
    encode: encode5,
    decodeUnsafe,
    decode: decode6
  };
}
var src = base;
var _brrp__multiformats_scope_baseX = src;
var base_x_default = _brrp__multiformats_scope_baseX;

// node_modules/multiformats/dist/src/bases/base.js
var Encoder = class {
  name;
  prefix;
  baseEncode;
  constructor(name2, prefix, baseEncode) {
    this.name = name2;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
  }
  encode(bytes2) {
    if (bytes2 instanceof Uint8Array) {
      return `${this.prefix}${this.baseEncode(bytes2)}`;
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};
var Decoder = class {
  name;
  prefix;
  baseDecode;
  prefixCodePoint;
  constructor(name2, prefix, baseDecode) {
    this.name = name2;
    this.prefix = prefix;
    if (prefix.codePointAt(0) === void 0) {
      throw new Error("Invalid prefix character");
    }
    this.prefixCodePoint = prefix.codePointAt(0);
    this.baseDecode = baseDecode;
  }
  decode(text) {
    if (typeof text === "string") {
      if (text.codePointAt(0) !== this.prefixCodePoint) {
        throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      }
      return this.baseDecode(text.slice(this.prefix.length));
    } else {
      throw Error("Can only multibase decode strings");
    }
  }
  or(decoder) {
    return or(this, decoder);
  }
};
var ComposedDecoder = class {
  decoders;
  constructor(decoders) {
    this.decoders = decoders;
  }
  or(decoder) {
    return or(this, decoder);
  }
  decode(input) {
    const prefix = input[0];
    const decoder = this.decoders[prefix];
    if (decoder != null) {
      return decoder.decode(input);
    } else {
      throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
    }
  }
};
function or(left, right) {
  return new ComposedDecoder({
    ...left.decoders ?? { [left.prefix]: left },
    ...right.decoders ?? { [right.prefix]: right }
  });
}
var Codec = class {
  name;
  prefix;
  baseEncode;
  baseDecode;
  encoder;
  decoder;
  constructor(name2, prefix, baseEncode, baseDecode) {
    this.name = name2;
    this.prefix = prefix;
    this.baseEncode = baseEncode;
    this.baseDecode = baseDecode;
    this.encoder = new Encoder(name2, prefix, baseEncode);
    this.decoder = new Decoder(name2, prefix, baseDecode);
  }
  encode(input) {
    return this.encoder.encode(input);
  }
  decode(input) {
    return this.decoder.decode(input);
  }
};
function from({ name: name2, prefix, encode: encode5, decode: decode6 }) {
  return new Codec(name2, prefix, encode5, decode6);
}
function baseX({ name: name2, prefix, alphabet: alphabet2 }) {
  const { encode: encode5, decode: decode6 } = base_x_default(alphabet2, name2);
  return from({
    prefix,
    name: name2,
    encode: encode5,
    decode: (text) => coerce(decode6(text))
  });
}
function decode(string2, alphabet2, bitsPerChar, name2) {
  const codes = {};
  for (let i = 0; i < alphabet2.length; ++i) {
    codes[alphabet2[i]] = i;
  }
  let end = string2.length;
  while (string2[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i = 0; i < end; ++i) {
    const value = codes[string2[i]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name2} character`);
    }
    buffer = buffer << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode(data, alphabet2, bitsPerChar) {
  const pad = alphabet2[alphabet2.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer = 0;
  for (let i = 0; i < data.length; ++i) {
    buffer = buffer << 8 | data[i];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet2[mask & buffer >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet2[mask & buffer << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc4648({ name: name2, prefix, bitsPerChar, alphabet: alphabet2 }) {
  return from({
    prefix,
    name: name2,
    encode(input) {
      return encode(input, alphabet2, bitsPerChar);
    },
    decode(input) {
      return decode(input, alphabet2, bitsPerChar, name2);
    }
  });
}

// node_modules/multiformats/dist/src/bases/base58.js
var base58btc = baseX({
  name: "base58btc",
  prefix: "z",
  alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr = baseX({
  name: "base58flickr",
  prefix: "Z",
  alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});

// node_modules/multiformats/dist/src/hashes/identity.js
var identity_exports = {};
__export(identity_exports, {
  identity: () => identity
});

// node_modules/multiformats/dist/src/vendor/varint.js
var encode_1 = encode2;
var MSB = 128;
var REST = 127;
var MSBALL = ~REST;
var INT = Math.pow(2, 31);
function encode2(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode2.bytes = offset - oldOffset + 1;
  return out;
}
var decode2 = read;
var MSB$1 = 128;
var REST$1 = 127;
function read(buf, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf[counter++];
    res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function(value) {
  return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};
var varint = {
  encode: encode_1,
  decode: decode2,
  encodingLength: length
};
var _brrp_varint = varint;
var varint_default = _brrp_varint;

// node_modules/multiformats/dist/src/varint.js
function decode3(data, offset = 0) {
  const code2 = varint_default.decode(data, offset);
  return [code2, varint_default.decode.bytes];
}
function encodeTo(int, target, offset = 0) {
  varint_default.encode(int, target, offset);
  return target;
}
function encodingLength(int) {
  return varint_default.encodingLength(int);
}

// node_modules/multiformats/dist/src/hashes/digest.js
function create(code2, digest2) {
  const size = digest2.byteLength;
  const sizeOffset = encodingLength(code2);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes2 = new Uint8Array(digestOffset + size);
  encodeTo(code2, bytes2, 0);
  encodeTo(size, bytes2, sizeOffset);
  bytes2.set(digest2, digestOffset);
  return new Digest(code2, size, digest2, bytes2);
}
function decode4(multihash) {
  const bytes2 = coerce(multihash);
  const [code2, sizeOffset] = decode3(bytes2);
  const [size, digestOffset] = decode3(bytes2.subarray(sizeOffset));
  const digest2 = bytes2.subarray(sizeOffset + digestOffset);
  if (digest2.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code2, size, digest2, bytes2);
}
function equals2(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals(a.bytes, data.bytes);
  }
}
var Digest = class {
  code;
  size;
  digest;
  bytes;
  /**
   * Creates a multihash digest.
   */
  constructor(code2, size, digest2, bytes2) {
    this.code = code2;
    this.size = size;
    this.digest = digest2;
    this.bytes = bytes2;
  }
};

// node_modules/multiformats/dist/src/hashes/identity.js
var code = 0;
var name = "identity";
var encode3 = coerce;
function digest(input) {
  return create(code, encode3(input));
}
var identity = { code, name, encode: encode3, digest };

// node_modules/multiformats/dist/src/hashes/sha2.js
var sha2_exports = {};
__export(sha2_exports, {
  sha256: () => sha256,
  sha512: () => sha512
});
import crypto from "crypto";

// node_modules/multiformats/dist/src/hashes/hasher.js
function from2({ name: name2, code: code2, encode: encode5 }) {
  return new Hasher(name2, code2, encode5);
}
var Hasher = class {
  name;
  code;
  encode;
  constructor(name2, code2, encode5) {
    this.name = name2;
    this.code = code2;
    this.encode = encode5;
  }
  digest(input) {
    if (input instanceof Uint8Array) {
      const result = this.encode(input);
      return result instanceof Uint8Array ? create(this.code, result) : result.then((digest2) => create(this.code, digest2));
    } else {
      throw Error("Unknown type, must be binary type");
    }
  }
};

// node_modules/multiformats/dist/src/hashes/sha2.js
var sha256 = from2({
  name: "sha2-256",
  code: 18,
  encode: (input) => coerce(crypto.createHash("sha256").update(input).digest())
});
var sha512 = from2({
  name: "sha2-512",
  code: 19,
  encode: (input) => coerce(crypto.createHash("sha512").update(input).digest())
});

// node_modules/uint8arrays/dist/src/equals.js
function equals3(a, b) {
  if (a === b) {
    return true;
  }
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// node_modules/uint8arrays/dist/src/util/as-uint8array.js
function asUint8Array(buf) {
  if (globalThis.Buffer != null) {
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  return buf;
}

// node_modules/uint8arrays/dist/src/alloc.js
function allocUnsafe(size = 0) {
  if (globalThis.Buffer?.allocUnsafe != null) {
    return asUint8Array(globalThis.Buffer.allocUnsafe(size));
  }
  return new Uint8Array(size);
}

// node_modules/uint8arrays/dist/src/concat.js
function concat(arrays, length3) {
  if (globalThis.Buffer != null) {
    return asUint8Array(globalThis.Buffer.concat(arrays, length3));
  }
  if (length3 == null) {
    length3 = arrays.reduce((acc, curr) => acc + curr.length, 0);
  }
  const output2 = allocUnsafe(length3);
  let offset = 0;
  for (const arr of arrays) {
    output2.set(arr, offset);
    offset += arr.length;
  }
  return asUint8Array(output2);
}

// node_modules/multiformats/dist/src/bases/base10.js
var base10_exports = {};
__export(base10_exports, {
  base10: () => base10
});
var base10 = baseX({
  prefix: "9",
  name: "base10",
  alphabet: "0123456789"
});

// node_modules/multiformats/dist/src/bases/base16.js
var base16_exports = {};
__export(base16_exports, {
  base16: () => base16,
  base16upper: () => base16upper
});
var base16 = rfc4648({
  prefix: "f",
  name: "base16",
  alphabet: "0123456789abcdef",
  bitsPerChar: 4
});
var base16upper = rfc4648({
  prefix: "F",
  name: "base16upper",
  alphabet: "0123456789ABCDEF",
  bitsPerChar: 4
});

// node_modules/multiformats/dist/src/bases/base2.js
var base2_exports = {};
__export(base2_exports, {
  base2: () => base2
});
var base2 = rfc4648({
  prefix: "0",
  name: "base2",
  alphabet: "01",
  bitsPerChar: 1
});

// node_modules/multiformats/dist/src/bases/base256emoji.js
var base256emoji_exports = {};
__export(base256emoji_exports, {
  base256emoji: () => base256emoji
});
var alphabet = Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}");
var alphabetBytesToChars = alphabet.reduce((p, c, i) => {
  p[i] = c;
  return p;
}, []);
var alphabetCharsToBytes = alphabet.reduce((p, c, i) => {
  p[c.codePointAt(0)] = i;
  return p;
}, []);
function encode4(data) {
  return data.reduce((p, c) => {
    p += alphabetBytesToChars[c];
    return p;
  }, "");
}
function decode5(str) {
  const byts = [];
  for (const char of str) {
    const byt = alphabetCharsToBytes[char.codePointAt(0)];
    if (byt === void 0) {
      throw new Error(`Non-base256emoji character: ${char}`);
    }
    byts.push(byt);
  }
  return new Uint8Array(byts);
}
var base256emoji = from({
  prefix: "\u{1F680}",
  name: "base256emoji",
  encode: encode4,
  decode: decode5
});

// node_modules/multiformats/dist/src/bases/base32.js
var base32_exports = {};
__export(base32_exports, {
  base32: () => base32,
  base32hex: () => base32hex,
  base32hexpad: () => base32hexpad,
  base32hexpadupper: () => base32hexpadupper,
  base32hexupper: () => base32hexupper,
  base32pad: () => base32pad,
  base32padupper: () => base32padupper,
  base32upper: () => base32upper,
  base32z: () => base32z
});
var base32 = rfc4648({
  prefix: "b",
  name: "base32",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  bitsPerChar: 5
});
var base32upper = rfc4648({
  prefix: "B",
  name: "base32upper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
  bitsPerChar: 5
});
var base32pad = rfc4648({
  prefix: "c",
  name: "base32pad",
  alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
  bitsPerChar: 5
});
var base32padupper = rfc4648({
  prefix: "C",
  name: "base32padupper",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
  bitsPerChar: 5
});
var base32hex = rfc4648({
  prefix: "v",
  name: "base32hex",
  alphabet: "0123456789abcdefghijklmnopqrstuv",
  bitsPerChar: 5
});
var base32hexupper = rfc4648({
  prefix: "V",
  name: "base32hexupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
  bitsPerChar: 5
});
var base32hexpad = rfc4648({
  prefix: "t",
  name: "base32hexpad",
  alphabet: "0123456789abcdefghijklmnopqrstuv=",
  bitsPerChar: 5
});
var base32hexpadupper = rfc4648({
  prefix: "T",
  name: "base32hexpadupper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
  bitsPerChar: 5
});
var base32z = rfc4648({
  prefix: "h",
  name: "base32z",
  alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
  bitsPerChar: 5
});

// node_modules/multiformats/dist/src/bases/base36.js
var base36_exports = {};
__export(base36_exports, {
  base36: () => base36,
  base36upper: () => base36upper
});
var base36 = baseX({
  prefix: "k",
  name: "base36",
  alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper = baseX({
  prefix: "K",
  name: "base36upper",
  alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});

// node_modules/multiformats/dist/src/bases/base64.js
var base64_exports = {};
__export(base64_exports, {
  base64: () => base64,
  base64pad: () => base64pad,
  base64url: () => base64url,
  base64urlpad: () => base64urlpad
});
var base64 = rfc4648({
  prefix: "m",
  name: "base64",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  bitsPerChar: 6
});
var base64pad = rfc4648({
  prefix: "M",
  name: "base64pad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  bitsPerChar: 6
});
var base64url = rfc4648({
  prefix: "u",
  name: "base64url",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  bitsPerChar: 6
});
var base64urlpad = rfc4648({
  prefix: "U",
  name: "base64urlpad",
  alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
  bitsPerChar: 6
});

// node_modules/multiformats/dist/src/bases/base8.js
var base8_exports = {};
__export(base8_exports, {
  base8: () => base8
});
var base8 = rfc4648({
  prefix: "7",
  name: "base8",
  alphabet: "01234567",
  bitsPerChar: 3
});

// node_modules/multiformats/dist/src/bases/identity.js
var identity_exports2 = {};
__export(identity_exports2, {
  identity: () => identity2
});
var identity2 = from({
  prefix: "\0",
  name: "identity",
  encode: (buf) => toString(buf),
  decode: (str) => fromString(str)
});

// node_modules/multiformats/dist/src/codecs/json.js
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();

// node_modules/multiformats/dist/src/cid.js
function format(link, base3) {
  const { bytes: bytes2, version } = link;
  switch (version) {
    case 0:
      return toStringV0(bytes2, baseCache(link), base3 ?? base58btc.encoder);
    default:
      return toStringV1(bytes2, baseCache(link), base3 ?? base32.encoder);
  }
}
var cache = /* @__PURE__ */ new WeakMap();
function baseCache(cid) {
  const baseCache2 = cache.get(cid);
  if (baseCache2 == null) {
    const baseCache3 = /* @__PURE__ */ new Map();
    cache.set(cid, baseCache3);
    return baseCache3;
  }
  return baseCache2;
}
var CID = class _CID {
  code;
  version;
  multihash;
  bytes;
  "/";
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param multihash - (Multi)hash of the of the content.
   */
  constructor(version, code2, multihash, bytes2) {
    this.code = code2;
    this.version = version;
    this.multihash = multihash;
    this.bytes = bytes2;
    this["/"] = bytes2;
  }
  /**
   * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
   * please either use `CID.asCID(cid)` or switch to new signalling mechanism
   *
   * @deprecated
   */
  get asCID() {
    return this;
  }
  // ArrayBufferView
  get byteOffset() {
    return this.bytes.byteOffset;
  }
  // ArrayBufferView
  get byteLength() {
    return this.bytes.byteLength;
  }
  toV0() {
    switch (this.version) {
      case 0: {
        return this;
      }
      case 1: {
        const { code: code2, multihash } = this;
        if (code2 !== DAG_PB_CODE) {
          throw new Error("Cannot convert a non dag-pb CID to CIDv0");
        }
        if (multihash.code !== SHA_256_CODE) {
          throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
        }
        return _CID.createV0(multihash);
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
      }
    }
  }
  toV1() {
    switch (this.version) {
      case 0: {
        const { code: code2, digest: digest2 } = this.multihash;
        const multihash = create(code2, digest2);
        return _CID.createV1(this.code, multihash);
      }
      case 1: {
        return this;
      }
      default: {
        throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
      }
    }
  }
  equals(other) {
    return _CID.equals(this, other);
  }
  static equals(self, other) {
    const unknown = other;
    return unknown != null && self.code === unknown.code && self.version === unknown.version && equals2(self.multihash, unknown.multihash);
  }
  toString(base3) {
    return format(this, base3);
  }
  toJSON() {
    return { "/": format(this) };
  }
  link() {
    return this;
  }
  [Symbol.toStringTag] = "CID";
  // Legacy
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `CID(${this.toString()})`;
  }
  /**
   * Takes any input `value` and returns a `CID` instance if it was
   * a `CID` otherwise returns `null`. If `value` is instanceof `CID`
   * it will return value back. If `value` is not instance of this CID
   * class, but is compatible CID it will return new instance of this
   * `CID` class. Otherwise returns null.
   *
   * This allows two different incompatible versions of CID library to
   * co-exist and interop as long as binary interface is compatible.
   */
  static asCID(input) {
    if (input == null) {
      return null;
    }
    const value = input;
    if (value instanceof _CID) {
      return value;
    } else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
      const { version, code: code2, multihash, bytes: bytes2 } = value;
      return new _CID(version, code2, multihash, bytes2 ?? encodeCID(version, code2, multihash.bytes));
    } else if (value[cidSymbol] === true) {
      const { version, multihash, code: code2 } = value;
      const digest2 = decode4(multihash);
      return _CID.create(version, code2, digest2);
    } else {
      return null;
    }
  }
  /**
   * @param version - Version of the CID
   * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
   * @param digest - (Multi)hash of the of the content.
   */
  static create(version, code2, digest2) {
    if (typeof code2 !== "number") {
      throw new Error("String codecs are no longer supported");
    }
    if (!(digest2.bytes instanceof Uint8Array)) {
      throw new Error("Invalid digest");
    }
    switch (version) {
      case 0: {
        if (code2 !== DAG_PB_CODE) {
          throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
        } else {
          return new _CID(version, code2, digest2, digest2.bytes);
        }
      }
      case 1: {
        const bytes2 = encodeCID(version, code2, digest2.bytes);
        return new _CID(version, code2, digest2, bytes2);
      }
      default: {
        throw new Error("Invalid version");
      }
    }
  }
  /**
   * Simplified version of `create` for CIDv0.
   */
  static createV0(digest2) {
    return _CID.create(0, DAG_PB_CODE, digest2);
  }
  /**
   * Simplified version of `create` for CIDv1.
   *
   * @param code - Content encoding format code.
   * @param digest - Multihash of the content.
   */
  static createV1(code2, digest2) {
    return _CID.create(1, code2, digest2);
  }
  /**
   * Decoded a CID from its binary representation. The byte array must contain
   * only the CID with no additional bytes.
   *
   * An error will be thrown if the bytes provided do not contain a valid
   * binary representation of a CID.
   */
  static decode(bytes2) {
    const [cid, remainder] = _CID.decodeFirst(bytes2);
    if (remainder.length !== 0) {
      throw new Error("Incorrect length");
    }
    return cid;
  }
  /**
   * Decoded a CID from its binary representation at the beginning of a byte
   * array.
   *
   * Returns an array with the first element containing the CID and the second
   * element containing the remainder of the original byte array. The remainder
   * will be a zero-length byte array if the provided bytes only contained a
   * binary CID representation.
   */
  static decodeFirst(bytes2) {
    const specs = _CID.inspectBytes(bytes2);
    const prefixSize = specs.size - specs.multihashSize;
    const multihashBytes = coerce(bytes2.subarray(prefixSize, prefixSize + specs.multihashSize));
    if (multihashBytes.byteLength !== specs.multihashSize) {
      throw new Error("Incorrect length");
    }
    const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
    const digest2 = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
    const cid = specs.version === 0 ? _CID.createV0(digest2) : _CID.createV1(specs.codec, digest2);
    return [cid, bytes2.subarray(specs.size)];
  }
  /**
   * Inspect the initial bytes of a CID to determine its properties.
   *
   * Involves decoding up to 4 varints. Typically this will require only 4 to 6
   * bytes but for larger multicodec code values and larger multihash digest
   * lengths these varints can be quite large. It is recommended that at least
   * 10 bytes be made available in the `initialBytes` argument for a complete
   * inspection.
   */
  static inspectBytes(initialBytes) {
    let offset = 0;
    const next = () => {
      const [i, length3] = decode3(initialBytes.subarray(offset));
      offset += length3;
      return i;
    };
    let version = next();
    let codec = DAG_PB_CODE;
    if (version === 18) {
      version = 0;
      offset = 0;
    } else {
      codec = next();
    }
    if (version !== 0 && version !== 1) {
      throw new RangeError(`Invalid CID version ${version}`);
    }
    const prefixSize = offset;
    const multihashCode = next();
    const digestSize = next();
    const size = offset + digestSize;
    const multihashSize = size - prefixSize;
    return { version, codec, multihashCode, digestSize, multihashSize, size };
  }
  /**
   * Takes cid in a string representation and creates an instance. If `base`
   * decoder is not provided will use a default from the configuration. It will
   * throw an error if encoding of the CID is not compatible with supplied (or
   * a default decoder).
   */
  static parse(source, base3) {
    const [prefix, bytes2] = parseCIDtoBytes(source, base3);
    const cid = _CID.decode(bytes2);
    if (cid.version === 0 && source[0] !== "Q") {
      throw Error("Version 0 CID string must not include multibase prefix");
    }
    baseCache(cid).set(prefix, source);
    return cid;
  }
};
function parseCIDtoBytes(source, base3) {
  switch (source[0]) {
    case "Q": {
      const decoder = base3 ?? base58btc;
      return [
        base58btc.prefix,
        decoder.decode(`${base58btc.prefix}${source}`)
      ];
    }
    case base58btc.prefix: {
      const decoder = base3 ?? base58btc;
      return [base58btc.prefix, decoder.decode(source)];
    }
    case base32.prefix: {
      const decoder = base3 ?? base32;
      return [base32.prefix, decoder.decode(source)];
    }
    default: {
      if (base3 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base3.decode(source)];
    }
  }
}
function toStringV0(bytes2, cache2, base3) {
  const { prefix } = base3;
  if (prefix !== base58btc.prefix) {
    throw Error(`Cannot string encode V0 in ${base3.name} encoding`);
  }
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes2).slice(1);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV1(bytes2, cache2, base3) {
  const { prefix } = base3;
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base3.encode(bytes2);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
var DAG_PB_CODE = 112;
var SHA_256_CODE = 18;
function encodeCID(version, code2, multihash) {
  const codeOffset = encodingLength(version);
  const hashOffset = codeOffset + encodingLength(code2);
  const bytes2 = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version, bytes2, 0);
  encodeTo(code2, bytes2, codeOffset);
  bytes2.set(multihash, hashOffset);
  return bytes2;
}
var cidSymbol = Symbol.for("@ipld/js-cid/CID");

// node_modules/multiformats/dist/src/basics.js
var bases = { ...identity_exports2, ...base2_exports, ...base8_exports, ...base10_exports, ...base16_exports, ...base32_exports, ...base36_exports, ...base58_exports, ...base64_exports, ...base256emoji_exports };
var hashes = { ...sha2_exports, ...identity_exports };

// node_modules/uint8arrays/dist/src/util/bases.js
function createCodec(name2, prefix, encode5, decode6) {
  return {
    name: name2,
    prefix,
    encoder: {
      name: name2,
      prefix,
      encode: encode5
    },
    decoder: {
      decode: decode6
    }
  };
}
var string = createCodec("utf8", "u", (buf) => {
  const decoder = new TextDecoder("utf8");
  return "u" + decoder.decode(buf);
}, (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str.substring(1));
});
var ascii = createCodec("ascii", "a", (buf) => {
  let string2 = "a";
  for (let i = 0; i < buf.length; i++) {
    string2 += String.fromCharCode(buf[i]);
  }
  return string2;
}, (str) => {
  str = str.substring(1);
  const buf = allocUnsafe(str.length);
  for (let i = 0; i < str.length; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
});
var BASES = {
  utf8: string,
  "utf-8": string,
  hex: bases.base16,
  latin1: ascii,
  ascii,
  binary: ascii,
  ...bases
};
var bases_default = BASES;

// node_modules/uint8arrays/dist/src/from-string.js
function fromString2(string2, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (base3 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return asUint8Array(globalThis.Buffer.from(string2, "utf-8"));
  }
  return base3.decoder.decode(`${base3.prefix}${string2}`);
}

// node_modules/@libp2p/crypto/dist/src/util.js
function isPromise(thing) {
  if (thing == null) {
    return false;
  }
  return typeof thing.then === "function" && typeof thing.catch === "function" && typeof thing.finally === "function";
}

// node_modules/@libp2p/crypto/dist/src/keys/ed25519.js
import crypto2 from "crypto";

// node_modules/uint8arrays/dist/src/to-string.js
function toString2(array, encoding = "utf8") {
  const base3 = bases_default[encoding];
  if (base3 == null) {
    throw new Error(`Unsupported encoding "${encoding}"`);
  }
  if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) {
    return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString("utf8");
  }
  return base3.encoder.encode(array).substring(1);
}

// node_modules/@libp2p/crypto/dist/src/keys/ed25519.js
var keypair = crypto2.generateKeyPairSync;
var PUBLIC_KEY_BYTE_LENGTH = 32;
var PRIVATE_KEY_BYTE_LENGTH = 64;
var KEYS_BYTE_LENGTH = 32;
var SIGNATURE_BYTE_LENGTH = 64;
function derivePublicKey(privateKey) {
  const keyObject = crypto2.createPrivateKey({
    format: "jwk",
    key: {
      crv: "Ed25519",
      x: "",
      d: toString2(privateKey, "base64url"),
      kty: "OKP"
    }
  });
  const jwk = keyObject.export({
    format: "jwk"
  });
  if (jwk.x == null || jwk.x === "") {
    throw new Error("Could not export JWK public key");
  }
  return fromString2(jwk.x, "base64url");
}
function generateKey() {
  const key = keypair("ed25519", {
    publicKeyEncoding: { type: "spki", format: "jwk" },
    privateKeyEncoding: { type: "pkcs8", format: "jwk" }
  });
  const privateKeyRaw = fromString2(key.privateKey.d, "base64url");
  const publicKeyRaw = fromString2(key.privateKey.x, "base64url");
  return {
    privateKey: concat([privateKeyRaw, publicKeyRaw], privateKeyRaw.byteLength + publicKeyRaw.byteLength),
    publicKey: publicKeyRaw
  };
}
function generateKeyFromSeed(seed) {
  if (seed.length !== KEYS_BYTE_LENGTH) {
    throw new TypeError('"seed" must be 32 bytes in length.');
  } else if (!(seed instanceof Uint8Array)) {
    throw new TypeError('"seed" must be a node.js Buffer, or Uint8Array.');
  }
  const publicKeyRaw = derivePublicKey(seed);
  return {
    privateKey: concat([seed, publicKeyRaw], seed.byteLength + publicKeyRaw.byteLength),
    publicKey: publicKeyRaw
  };
}
function hashAndSign(key, msg) {
  if (!(key instanceof Uint8Array)) {
    throw new TypeError('"key" must be a node.js Buffer, or Uint8Array.');
  }
  let privateKey;
  let publicKey;
  if (key.byteLength === PRIVATE_KEY_BYTE_LENGTH) {
    privateKey = key.subarray(0, 32);
    publicKey = key.subarray(32);
  } else if (key.byteLength === KEYS_BYTE_LENGTH) {
    privateKey = key.subarray(0, 32);
    publicKey = derivePublicKey(privateKey);
  } else {
    throw new TypeError('"key" must be 64 or 32 bytes in length.');
  }
  const obj = crypto2.createPrivateKey({
    format: "jwk",
    key: {
      crv: "Ed25519",
      d: toString2(privateKey, "base64url"),
      x: toString2(publicKey, "base64url"),
      kty: "OKP"
    }
  });
  return crypto2.sign(null, msg instanceof Uint8Array ? msg : msg.subarray(), obj);
}
function hashAndVerify(key, sig, msg) {
  if (key.byteLength !== PUBLIC_KEY_BYTE_LENGTH) {
    throw new TypeError('"key" must be 32 bytes in length.');
  } else if (!(key instanceof Uint8Array)) {
    throw new TypeError('"key" must be a node.js Buffer, or Uint8Array.');
  }
  if (sig.byteLength !== SIGNATURE_BYTE_LENGTH) {
    throw new TypeError('"sig" must be 64 bytes in length.');
  } else if (!(sig instanceof Uint8Array)) {
    throw new TypeError('"sig" must be a node.js Buffer, or Uint8Array.');
  }
  const obj = crypto2.createPublicKey({
    format: "jwk",
    key: {
      crv: "Ed25519",
      x: toString2(key, "base64url"),
      kty: "OKP"
    }
  });
  return crypto2.verify(null, msg instanceof Uint8Array ? msg : msg.subarray(), obj, sig);
}

// node_modules/@libp2p/crypto/dist/src/ciphers/aes-gcm.js
import crypto3 from "crypto";
function create2(opts) {
  const algorithm = opts?.algorithm ?? "aes-128-gcm";
  const keyLength = opts?.keyLength ?? 16;
  const nonceLength = opts?.nonceLength ?? 12;
  const digest2 = opts?.digest ?? "sha256";
  const saltLength = opts?.saltLength ?? 16;
  const iterations = opts?.iterations ?? 32767;
  const algorithmTagLength = opts?.algorithmTagLength ?? 16;
  function encryptWithKey(data, key) {
    const nonce = crypto3.randomBytes(nonceLength);
    const cipher2 = crypto3.createCipheriv(algorithm, key, nonce);
    const ciphertext = concat([cipher2.update(data), cipher2.final()]);
    return concat([nonce, ciphertext, cipher2.getAuthTag()]);
  }
  async function encrypt(data, password) {
    const salt = crypto3.randomBytes(saltLength);
    if (typeof password === "string") {
      password = fromString2(password);
    }
    const key = crypto3.pbkdf2Sync(password, salt, iterations, keyLength, digest2);
    return concat([salt, encryptWithKey(Uint8Array.from(data), key)]);
  }
  function decryptWithKey(ciphertextAndNonce, key) {
    const nonce = ciphertextAndNonce.subarray(0, nonceLength);
    const ciphertext = ciphertextAndNonce.subarray(nonceLength, ciphertextAndNonce.length - algorithmTagLength);
    const tag = ciphertextAndNonce.subarray(ciphertext.length + nonceLength);
    const cipher2 = crypto3.createDecipheriv(algorithm, key, nonce);
    cipher2.setAuthTag(tag);
    return concat([cipher2.update(ciphertext), cipher2.final()]);
  }
  async function decrypt(data, password) {
    const salt = data.subarray(0, saltLength);
    const ciphertextAndNonce = data.subarray(saltLength);
    if (typeof password === "string") {
      password = fromString2(password);
    }
    const key = crypto3.pbkdf2Sync(password, salt, iterations, keyLength, digest2);
    return decryptWithKey(ciphertextAndNonce, key);
  }
  const cipher = {
    encrypt,
    decrypt
  };
  return cipher;
}

// node_modules/@libp2p/crypto/dist/src/keys/exporter.js
async function exporter(privateKey, password) {
  const cipher = create2();
  const encryptedKey = await cipher.encrypt(privateKey, password);
  return base64.encode(encryptedKey);
}

// node_modules/@libp2p/crypto/dist/src/keys/keys.js
var keys_exports = {};
__export(keys_exports, {
  KeyType: () => KeyType,
  PrivateKey: () => PrivateKey,
  PublicKey: () => PublicKey
});

// node_modules/protons-runtime/dist/src/utils/float.js
var f32 = new Float32Array([-0]);
var f8b = new Uint8Array(f32.buffer);
function writeFloatLE(val, buf, pos) {
  f32[0] = val;
  buf[pos] = f8b[0];
  buf[pos + 1] = f8b[1];
  buf[pos + 2] = f8b[2];
  buf[pos + 3] = f8b[3];
}
function readFloatLE(buf, pos) {
  f8b[0] = buf[pos];
  f8b[1] = buf[pos + 1];
  f8b[2] = buf[pos + 2];
  f8b[3] = buf[pos + 3];
  return f32[0];
}
var f64 = new Float64Array([-0]);
var d8b = new Uint8Array(f64.buffer);
function writeDoubleLE(val, buf, pos) {
  f64[0] = val;
  buf[pos] = d8b[0];
  buf[pos + 1] = d8b[1];
  buf[pos + 2] = d8b[2];
  buf[pos + 3] = d8b[3];
  buf[pos + 4] = d8b[4];
  buf[pos + 5] = d8b[5];
  buf[pos + 6] = d8b[6];
  buf[pos + 7] = d8b[7];
}
function readDoubleLE(buf, pos) {
  d8b[0] = buf[pos];
  d8b[1] = buf[pos + 1];
  d8b[2] = buf[pos + 2];
  d8b[3] = buf[pos + 3];
  d8b[4] = buf[pos + 4];
  d8b[5] = buf[pos + 5];
  d8b[6] = buf[pos + 6];
  d8b[7] = buf[pos + 7];
  return f64[0];
}

// node_modules/protons-runtime/dist/src/utils/longbits.js
var MAX_SAFE_NUMBER_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
var MIN_SAFE_NUMBER_INTEGER = BigInt(Number.MIN_SAFE_INTEGER);
var LongBits = class _LongBits {
  lo;
  hi;
  constructor(lo, hi) {
    this.lo = lo | 0;
    this.hi = hi | 0;
  }
  /**
   * Converts this long bits to a possibly unsafe JavaScript number
   */
  toNumber(unsigned = false) {
    if (!unsigned && this.hi >>> 31 > 0) {
      const lo = ~this.lo + 1 >>> 0;
      let hi = ~this.hi >>> 0;
      if (lo === 0) {
        hi = hi + 1 >>> 0;
      }
      return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
  }
  /**
   * Converts this long bits to a bigint
   */
  toBigInt(unsigned = false) {
    if (unsigned) {
      return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
    }
    if (this.hi >>> 31 !== 0) {
      const lo = ~this.lo + 1 >>> 0;
      let hi = ~this.hi >>> 0;
      if (lo === 0) {
        hi = hi + 1 >>> 0;
      }
      return -(BigInt(lo) + (BigInt(hi) << 32n));
    }
    return BigInt(this.lo >>> 0) + (BigInt(this.hi >>> 0) << 32n);
  }
  /**
   * Converts this long bits to a string
   */
  toString(unsigned = false) {
    return this.toBigInt(unsigned).toString();
  }
  /**
   * Zig-zag encodes this long bits
   */
  zzEncode() {
    const mask = this.hi >> 31;
    this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo = (this.lo << 1 ^ mask) >>> 0;
    return this;
  }
  /**
   * Zig-zag decodes this long bits
   */
  zzDecode() {
    const mask = -(this.lo & 1);
    this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi = (this.hi >>> 1 ^ mask) >>> 0;
    return this;
  }
  /**
   * Calculates the length of this longbits when encoded as a varint.
   */
  length() {
    const part0 = this.lo;
    const part1 = (this.lo >>> 28 | this.hi << 4) >>> 0;
    const part2 = this.hi >>> 24;
    return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
  }
  /**
   * Constructs new long bits from the specified number
   */
  static fromBigInt(value) {
    if (value === 0n) {
      return zero;
    }
    if (value < MAX_SAFE_NUMBER_INTEGER && value > MIN_SAFE_NUMBER_INTEGER) {
      return this.fromNumber(Number(value));
    }
    const negative = value < 0n;
    if (negative) {
      value = -value;
    }
    let hi = value >> 32n;
    let lo = value - (hi << 32n);
    if (negative) {
      hi = ~hi | 0n;
      lo = ~lo | 0n;
      if (++lo > TWO_32) {
        lo = 0n;
        if (++hi > TWO_32) {
          hi = 0n;
        }
      }
    }
    return new _LongBits(Number(lo), Number(hi));
  }
  /**
   * Constructs new long bits from the specified number
   */
  static fromNumber(value) {
    if (value === 0) {
      return zero;
    }
    const sign = value < 0;
    if (sign) {
      value = -value;
    }
    let lo = value >>> 0;
    let hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
      hi = ~hi >>> 0;
      lo = ~lo >>> 0;
      if (++lo > 4294967295) {
        lo = 0;
        if (++hi > 4294967295) {
          hi = 0;
        }
      }
    }
    return new _LongBits(lo, hi);
  }
  /**
   * Constructs new long bits from a number, long or string
   */
  static from(value) {
    if (typeof value === "number") {
      return _LongBits.fromNumber(value);
    }
    if (typeof value === "bigint") {
      return _LongBits.fromBigInt(value);
    }
    if (typeof value === "string") {
      return _LongBits.fromBigInt(BigInt(value));
    }
    return value.low != null || value.high != null ? new _LongBits(value.low >>> 0, value.high >>> 0) : zero;
  }
};
var zero = new LongBits(0, 0);
zero.toBigInt = function() {
  return 0n;
};
zero.zzEncode = zero.zzDecode = function() {
  return this;
};
zero.length = function() {
  return 1;
};
var TWO_32 = 4294967296n;

// node_modules/protons-runtime/dist/src/utils/utf8.js
function length2(string2) {
  let len = 0;
  let c = 0;
  for (let i = 0; i < string2.length; ++i) {
    c = string2.charCodeAt(i);
    if (c < 128) {
      len += 1;
    } else if (c < 2048) {
      len += 2;
    } else if ((c & 64512) === 55296 && (string2.charCodeAt(i + 1) & 64512) === 56320) {
      ++i;
      len += 4;
    } else {
      len += 3;
    }
  }
  return len;
}
function read2(buffer, start, end) {
  const len = end - start;
  if (len < 1) {
    return "";
  }
  let parts;
  const chunk = [];
  let i = 0;
  let t;
  while (start < end) {
    t = buffer[start++];
    if (t < 128) {
      chunk[i++] = t;
    } else if (t > 191 && t < 224) {
      chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
    } else if (t > 239 && t < 365) {
      t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
      chunk[i++] = 55296 + (t >> 10);
      chunk[i++] = 56320 + (t & 1023);
    } else {
      chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
    }
    if (i > 8191) {
      (parts ?? (parts = [])).push(String.fromCharCode.apply(String, chunk));
      i = 0;
    }
  }
  if (parts != null) {
    if (i > 0) {
      parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
    }
    return parts.join("");
  }
  return String.fromCharCode.apply(String, chunk.slice(0, i));
}
function write(string2, buffer, offset) {
  const start = offset;
  let c1;
  let c2;
  for (let i = 0; i < string2.length; ++i) {
    c1 = string2.charCodeAt(i);
    if (c1 < 128) {
      buffer[offset++] = c1;
    } else if (c1 < 2048) {
      buffer[offset++] = c1 >> 6 | 192;
      buffer[offset++] = c1 & 63 | 128;
    } else if ((c1 & 64512) === 55296 && ((c2 = string2.charCodeAt(i + 1)) & 64512) === 56320) {
      c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
      ++i;
      buffer[offset++] = c1 >> 18 | 240;
      buffer[offset++] = c1 >> 12 & 63 | 128;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    } else {
      buffer[offset++] = c1 >> 12 | 224;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    }
  }
  return offset - start;
}

// node_modules/protons-runtime/dist/src/utils/reader.js
function indexOutOfRange(reader, writeLength) {
  return RangeError(`index out of range: ${reader.pos} + ${writeLength ?? 1} > ${reader.len}`);
}
function readFixed32End(buf, end) {
  return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
}
var Uint8ArrayReader = class {
  buf;
  pos;
  len;
  _slice = Uint8Array.prototype.subarray;
  constructor(buffer) {
    this.buf = buffer;
    this.pos = 0;
    this.len = buffer.length;
  }
  /**
   * Reads a varint as an unsigned 32 bit value
   */
  uint32() {
    let value = 4294967295;
    value = (this.buf[this.pos] & 127) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
    if (this.buf[this.pos++] < 128)
      return value;
    if ((this.pos += 5) > this.len) {
      this.pos = this.len;
      throw indexOutOfRange(this, 10);
    }
    return value;
  }
  /**
   * Reads a varint as a signed 32 bit value
   */
  int32() {
    return this.uint32() | 0;
  }
  /**
   * Reads a zig-zag encoded varint as a signed 32 bit value
   */
  sint32() {
    const value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
  }
  /**
   * Reads a varint as a boolean
   */
  bool() {
    return this.uint32() !== 0;
  }
  /**
   * Reads fixed 32 bits as an unsigned 32 bit integer
   */
  fixed32() {
    if (this.pos + 4 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const res = readFixed32End(this.buf, this.pos += 4);
    return res;
  }
  /**
   * Reads fixed 32 bits as a signed 32 bit integer
   */
  sfixed32() {
    if (this.pos + 4 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const res = readFixed32End(this.buf, this.pos += 4) | 0;
    return res;
  }
  /**
   * Reads a float (32 bit) as a number
   */
  float() {
    if (this.pos + 4 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const value = readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
  }
  /**
   * Reads a double (64 bit float) as a number
   */
  double() {
    if (this.pos + 8 > this.len) {
      throw indexOutOfRange(this, 4);
    }
    const value = readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
  }
  /**
   * Reads a sequence of bytes preceded by its length as a varint
   */
  bytes() {
    const length3 = this.uint32();
    const start = this.pos;
    const end = this.pos + length3;
    if (end > this.len) {
      throw indexOutOfRange(this, length3);
    }
    this.pos += length3;
    return start === end ? new Uint8Array(0) : this.buf.subarray(start, end);
  }
  /**
   * Reads a string preceded by its byte length as a varint
   */
  string() {
    const bytes2 = this.bytes();
    return read2(bytes2, 0, bytes2.length);
  }
  /**
   * Skips the specified number of bytes if specified, otherwise skips a varint
   */
  skip(length3) {
    if (typeof length3 === "number") {
      if (this.pos + length3 > this.len) {
        throw indexOutOfRange(this, length3);
      }
      this.pos += length3;
    } else {
      do {
        if (this.pos >= this.len) {
          throw indexOutOfRange(this);
        }
      } while ((this.buf[this.pos++] & 128) !== 0);
    }
    return this;
  }
  /**
   * Skips the next element of the specified wire type
   */
  skipType(wireType) {
    switch (wireType) {
      case 0:
        this.skip();
        break;
      case 1:
        this.skip(8);
        break;
      case 2:
        this.skip(this.uint32());
        break;
      case 3:
        while ((wireType = this.uint32() & 7) !== 4) {
          this.skipType(wireType);
        }
        break;
      case 5:
        this.skip(4);
        break;
      default:
        throw Error(`invalid wire type ${wireType} at offset ${this.pos}`);
    }
    return this;
  }
  readLongVarint() {
    const bits = new LongBits(0, 0);
    let i = 0;
    if (this.len - this.pos > 4) {
      for (; i < 4; ++i) {
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
      bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
      bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
      if (this.buf[this.pos++] < 128) {
        return bits;
      }
      i = 0;
    } else {
      for (; i < 3; ++i) {
        if (this.pos >= this.len) {
          throw indexOutOfRange(this);
        }
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
      bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
      return bits;
    }
    if (this.len - this.pos > 4) {
      for (; i < 5; ++i) {
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
    } else {
      for (; i < 5; ++i) {
        if (this.pos >= this.len) {
          throw indexOutOfRange(this);
        }
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
        if (this.buf[this.pos++] < 128) {
          return bits;
        }
      }
    }
    throw Error("invalid varint encoding");
  }
  readFixed64() {
    if (this.pos + 8 > this.len) {
      throw indexOutOfRange(this, 8);
    }
    const lo = readFixed32End(this.buf, this.pos += 4);
    const hi = readFixed32End(this.buf, this.pos += 4);
    return new LongBits(lo, hi);
  }
  /**
   * Reads a varint as a signed 64 bit value
   */
  int64() {
    return this.readLongVarint().toBigInt();
  }
  /**
   * Reads a varint as a signed 64 bit value returned as a possibly unsafe
   * JavaScript number
   */
  int64Number() {
    return this.readLongVarint().toNumber();
  }
  /**
   * Reads a varint as a signed 64 bit value returned as a string
   */
  int64String() {
    return this.readLongVarint().toString();
  }
  /**
   * Reads a varint as an unsigned 64 bit value
   */
  uint64() {
    return this.readLongVarint().toBigInt(true);
  }
  /**
   * Reads a varint as an unsigned 64 bit value returned as a possibly unsafe
   * JavaScript number
   */
  uint64Number() {
    return this.readLongVarint().toNumber(true);
  }
  /**
   * Reads a varint as an unsigned 64 bit value returned as a string
   */
  uint64String() {
    return this.readLongVarint().toString(true);
  }
  /**
   * Reads a zig-zag encoded varint as a signed 64 bit value
   */
  sint64() {
    return this.readLongVarint().zzDecode().toBigInt();
  }
  /**
   * Reads a zig-zag encoded varint as a signed 64 bit value returned as a
   * possibly unsafe JavaScript number
   */
  sint64Number() {
    return this.readLongVarint().zzDecode().toNumber();
  }
  /**
   * Reads a zig-zag encoded varint as a signed 64 bit value returned as a
   * string
   */
  sint64String() {
    return this.readLongVarint().zzDecode().toString();
  }
  /**
   * Reads fixed 64 bits
   */
  fixed64() {
    return this.readFixed64().toBigInt();
  }
  /**
   * Reads fixed 64 bits returned as a possibly unsafe JavaScript number
   */
  fixed64Number() {
    return this.readFixed64().toNumber();
  }
  /**
   * Reads fixed 64 bits returned as a string
   */
  fixed64String() {
    return this.readFixed64().toString();
  }
  /**
   * Reads zig-zag encoded fixed 64 bits
   */
  sfixed64() {
    return this.readFixed64().toBigInt();
  }
  /**
   * Reads zig-zag encoded fixed 64 bits returned as a possibly unsafe
   * JavaScript number
   */
  sfixed64Number() {
    return this.readFixed64().toNumber();
  }
  /**
   * Reads zig-zag encoded fixed 64 bits returned as a string
   */
  sfixed64String() {
    return this.readFixed64().toString();
  }
};
function createReader(buf) {
  return new Uint8ArrayReader(buf instanceof Uint8Array ? buf : buf.subarray());
}

// node_modules/protons-runtime/dist/src/decode.js
function decodeMessage(buf, codec) {
  const reader = createReader(buf);
  return codec.decode(reader);
}

// node_modules/protons-runtime/dist/src/utils/pool.js
function pool(size) {
  const SIZE = size ?? 8192;
  const MAX = SIZE >>> 1;
  let slab;
  let offset = SIZE;
  return function poolAlloc(size2) {
    if (size2 < 1 || size2 > MAX) {
      return allocUnsafe(size2);
    }
    if (offset + size2 > SIZE) {
      slab = allocUnsafe(SIZE);
      offset = 0;
    }
    const buf = slab.subarray(offset, offset += size2);
    if ((offset & 7) !== 0) {
      offset = (offset | 7) + 1;
    }
    return buf;
  };
}

// node_modules/protons-runtime/dist/src/utils/writer.js
var Op = class {
  /**
   * Function to call
   */
  fn;
  /**
   * Value byte length
   */
  len;
  /**
   * Next operation
   */
  next;
  /**
   * Value to write
   */
  val;
  constructor(fn, len, val) {
    this.fn = fn;
    this.len = len;
    this.next = void 0;
    this.val = val;
  }
};
function noop() {
}
var State = class {
  /**
   * Current head
   */
  head;
  /**
   * Current tail
   */
  tail;
  /**
   * Current buffer length
   */
  len;
  /**
   * Next state
   */
  next;
  constructor(writer) {
    this.head = writer.head;
    this.tail = writer.tail;
    this.len = writer.len;
    this.next = writer.states;
  }
};
var bufferPool = pool();
function alloc(size) {
  if (globalThis.Buffer != null) {
    return allocUnsafe(size);
  }
  return bufferPool(size);
}
var Uint8ArrayWriter = class {
  /**
   * Current length
   */
  len;
  /**
   * Operations head
   */
  head;
  /**
   * Operations tail
   */
  tail;
  /**
   * Linked forked states
   */
  states;
  constructor() {
    this.len = 0;
    this.head = new Op(noop, 0, 0);
    this.tail = this.head;
    this.states = null;
  }
  /**
   * Pushes a new operation to the queue
   */
  _push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
  }
  /**
   * Writes an unsigned 32 bit value as a varint
   */
  uint32(value) {
    this.len += (this.tail = this.tail.next = new VarintOp((value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
    return this;
  }
  /**
   * Writes a signed 32 bit value as a varint`
   */
  int32(value) {
    return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
  }
  /**
   * Writes a 32 bit value as a varint, zig-zag encoded
   */
  sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64(value) {
    const bits = LongBits.fromBigInt(value);
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64Number(value) {
    const bits = LongBits.fromNumber(value);
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes an unsigned 64 bit value as a varint
   */
  uint64String(value) {
    return this.uint64(BigInt(value));
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64(value) {
    return this.uint64(value);
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64Number(value) {
    return this.uint64Number(value);
  }
  /**
   * Writes a signed 64 bit value as a varint
   */
  int64String(value) {
    return this.uint64String(value);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64(value) {
    const bits = LongBits.fromBigInt(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64Number(value) {
    const bits = LongBits.fromNumber(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
  }
  /**
   * Writes a signed 64 bit value as a varint, zig-zag encoded
   */
  sint64String(value) {
    return this.sint64(BigInt(value));
  }
  /**
   * Writes a boolish value as a varint
   */
  bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
  }
  /**
   * Writes an unsigned 32 bit value as fixed 32 bits
   */
  fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
  }
  /**
   * Writes a signed 32 bit value as fixed 32 bits
   */
  sfixed32(value) {
    return this.fixed32(value);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64(value) {
    const bits = LongBits.fromBigInt(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64Number(value) {
    const bits = LongBits.fromNumber(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
  }
  /**
   * Writes an unsigned 64 bit value as fixed 64 bits
   */
  fixed64String(value) {
    return this.fixed64(BigInt(value));
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64(value) {
    return this.fixed64(value);
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64Number(value) {
    return this.fixed64Number(value);
  }
  /**
   * Writes a signed 64 bit value as fixed 64 bits
   */
  sfixed64String(value) {
    return this.fixed64String(value);
  }
  /**
   * Writes a float (32 bit)
   */
  float(value) {
    return this._push(writeFloatLE, 4, value);
  }
  /**
   * Writes a double (64 bit float).
   *
   * @function
   * @param {number} value - Value to write
   * @returns {Writer} `this`
   */
  double(value) {
    return this._push(writeDoubleLE, 8, value);
  }
  /**
   * Writes a sequence of bytes
   */
  bytes(value) {
    const len = value.length >>> 0;
    if (len === 0) {
      return this._push(writeByte, 1, 0);
    }
    return this.uint32(len)._push(writeBytes, len, value);
  }
  /**
   * Writes a string
   */
  string(value) {
    const len = length2(value);
    return len !== 0 ? this.uint32(len)._push(write, len, value) : this._push(writeByte, 1, 0);
  }
  /**
   * Forks this writer's state by pushing it to a stack.
   * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
   */
  fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
  }
  /**
   * Resets this instance to the last state
   */
  reset() {
    if (this.states != null) {
      this.head = this.states.head;
      this.tail = this.states.tail;
      this.len = this.states.len;
      this.states = this.states.next;
    } else {
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
    }
    return this;
  }
  /**
   * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
   */
  ldelim() {
    const head = this.head;
    const tail = this.tail;
    const len = this.len;
    this.reset().uint32(len);
    if (len !== 0) {
      this.tail.next = head.next;
      this.tail = tail;
      this.len += len;
    }
    return this;
  }
  /**
   * Finishes the write operation
   */
  finish() {
    let head = this.head.next;
    const buf = alloc(this.len);
    let pos = 0;
    while (head != null) {
      head.fn(head.val, buf, pos);
      pos += head.len;
      head = head.next;
    }
    return buf;
  }
};
function writeByte(val, buf, pos) {
  buf[pos] = val & 255;
}
function writeVarint32(val, buf, pos) {
  while (val > 127) {
    buf[pos++] = val & 127 | 128;
    val >>>= 7;
  }
  buf[pos] = val;
}
var VarintOp = class extends Op {
  next;
  constructor(len, val) {
    super(writeVarint32, len, val);
    this.next = void 0;
  }
};
function writeVarint64(val, buf, pos) {
  while (val.hi !== 0) {
    buf[pos++] = val.lo & 127 | 128;
    val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
    val.hi >>>= 7;
  }
  while (val.lo > 127) {
    buf[pos++] = val.lo & 127 | 128;
    val.lo = val.lo >>> 7;
  }
  buf[pos++] = val.lo;
}
function writeFixed32(val, buf, pos) {
  buf[pos] = val & 255;
  buf[pos + 1] = val >>> 8 & 255;
  buf[pos + 2] = val >>> 16 & 255;
  buf[pos + 3] = val >>> 24;
}
function writeBytes(val, buf, pos) {
  buf.set(val, pos);
}
if (globalThis.Buffer != null) {
  Uint8ArrayWriter.prototype.bytes = function(value) {
    const len = value.length >>> 0;
    this.uint32(len);
    if (len > 0) {
      this._push(writeBytesBuffer, len, value);
    }
    return this;
  };
  Uint8ArrayWriter.prototype.string = function(value) {
    const len = globalThis.Buffer.byteLength(value);
    this.uint32(len);
    if (len > 0) {
      this._push(writeStringBuffer, len, value);
    }
    return this;
  };
}
function writeBytesBuffer(val, buf, pos) {
  buf.set(val, pos);
}
function writeStringBuffer(val, buf, pos) {
  if (val.length < 40) {
    write(val, buf, pos);
  } else if (buf.utf8Write != null) {
    buf.utf8Write(val, pos);
  } else {
    buf.set(fromString2(val), pos);
  }
}
function createWriter() {
  return new Uint8ArrayWriter();
}

// node_modules/protons-runtime/dist/src/encode.js
function encodeMessage(message2, codec) {
  const w = createWriter();
  codec.encode(message2, w, {
    lengthDelimited: false
  });
  return w.finish();
}

// node_modules/protons-runtime/dist/src/codec.js
var CODEC_TYPES;
(function(CODEC_TYPES2) {
  CODEC_TYPES2[CODEC_TYPES2["VARINT"] = 0] = "VARINT";
  CODEC_TYPES2[CODEC_TYPES2["BIT64"] = 1] = "BIT64";
  CODEC_TYPES2[CODEC_TYPES2["LENGTH_DELIMITED"] = 2] = "LENGTH_DELIMITED";
  CODEC_TYPES2[CODEC_TYPES2["START_GROUP"] = 3] = "START_GROUP";
  CODEC_TYPES2[CODEC_TYPES2["END_GROUP"] = 4] = "END_GROUP";
  CODEC_TYPES2[CODEC_TYPES2["BIT32"] = 5] = "BIT32";
})(CODEC_TYPES || (CODEC_TYPES = {}));
function createCodec2(name2, type, encode5, decode6) {
  return {
    name: name2,
    type,
    encode: encode5,
    decode: decode6
  };
}

// node_modules/protons-runtime/dist/src/codecs/enum.js
function enumeration(v) {
  function findValue(val) {
    if (v[val.toString()] == null) {
      throw new Error("Invalid enum value");
    }
    return v[val];
  }
  const encode5 = function enumEncode(val, writer) {
    const enumValue = findValue(val);
    writer.int32(enumValue);
  };
  const decode6 = function enumDecode(reader) {
    const val = reader.int32();
    return findValue(val);
  };
  return createCodec2("enum", CODEC_TYPES.VARINT, encode5, decode6);
}

// node_modules/protons-runtime/dist/src/codecs/message.js
function message(encode5, decode6) {
  return createCodec2("message", CODEC_TYPES.LENGTH_DELIMITED, encode5, decode6);
}

// node_modules/@libp2p/crypto/dist/src/keys/keys.js
var KeyType;
(function(KeyType2) {
  KeyType2["RSA"] = "RSA";
  KeyType2["Ed25519"] = "Ed25519";
  KeyType2["Secp256k1"] = "Secp256k1";
})(KeyType || (KeyType = {}));
var __KeyTypeValues;
(function(__KeyTypeValues2) {
  __KeyTypeValues2[__KeyTypeValues2["RSA"] = 0] = "RSA";
  __KeyTypeValues2[__KeyTypeValues2["Ed25519"] = 1] = "Ed25519";
  __KeyTypeValues2[__KeyTypeValues2["Secp256k1"] = 2] = "Secp256k1";
})(__KeyTypeValues || (__KeyTypeValues = {}));
(function(KeyType2) {
  KeyType2.codec = () => {
    return enumeration(__KeyTypeValues);
  };
})(KeyType || (KeyType = {}));
var PublicKey;
(function(PublicKey2) {
  let _codec;
  PublicKey2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.Type != null) {
          w.uint32(8);
          KeyType.codec().encode(obj.Type, w);
        }
        if (obj.Data != null) {
          w.uint32(18);
          w.bytes(obj.Data);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length3) => {
        const obj = {};
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Type = KeyType.codec().decode(reader);
              break;
            case 2:
              obj.Data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PublicKey2.encode = (obj) => {
    return encodeMessage(obj, PublicKey2.codec());
  };
  PublicKey2.decode = (buf) => {
    return decodeMessage(buf, PublicKey2.codec());
  };
})(PublicKey || (PublicKey = {}));
var PrivateKey;
(function(PrivateKey2) {
  let _codec;
  PrivateKey2.codec = () => {
    if (_codec == null) {
      _codec = message((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork();
        }
        if (obj.Type != null) {
          w.uint32(8);
          KeyType.codec().encode(obj.Type, w);
        }
        if (obj.Data != null) {
          w.uint32(18);
          w.bytes(obj.Data);
        }
        if (opts.lengthDelimited !== false) {
          w.ldelim();
        }
      }, (reader, length3) => {
        const obj = {};
        const end = length3 == null ? reader.len : reader.pos + length3;
        while (reader.pos < end) {
          const tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              obj.Type = KeyType.codec().decode(reader);
              break;
            case 2:
              obj.Data = reader.bytes();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return obj;
      });
    }
    return _codec;
  };
  PrivateKey2.encode = (obj) => {
    return encodeMessage(obj, PrivateKey2.codec());
  };
  PrivateKey2.decode = (buf) => {
    return decodeMessage(buf, PrivateKey2.codec());
  };
})(PrivateKey || (PrivateKey = {}));

// node_modules/@libp2p/crypto/dist/src/keys/ed25519-class.js
var Ed25519PublicKey = class {
  _key;
  constructor(key) {
    this._key = ensureKey(key, PUBLIC_KEY_BYTE_LENGTH);
  }
  verify(data, sig) {
    return hashAndVerify(this._key, sig, data);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PublicKey.encode({
      Type: KeyType.Ed25519,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
};
var Ed25519PrivateKey = class {
  _key;
  _publicKey;
  // key       - 64 byte Uint8Array containing private key
  // publicKey - 32 byte Uint8Array containing public key
  constructor(key, publicKey) {
    this._key = ensureKey(key, PRIVATE_KEY_BYTE_LENGTH);
    this._publicKey = ensureKey(publicKey, PUBLIC_KEY_BYTE_LENGTH);
  }
  sign(message2) {
    return hashAndSign(this._key, message2);
  }
  get public() {
    return new Ed25519PublicKey(this._publicKey);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PrivateKey.encode({
      Type: KeyType.Ed25519,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  async hash() {
    const p = sha256.digest(this.bytes);
    let bytes2;
    if (isPromise(p)) {
      ({ bytes: bytes2 } = await p);
    } else {
      bytes2 = p.bytes;
    }
    return bytes2;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the identity multihash containing its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   *
   * @returns {Promise<string>}
   */
  async id() {
    const encoding = identity.digest(this.public.bytes);
    return base58btc.encode(encoding.bytes).substring(1);
  }
  /**
   * Exports the key into a password protected `format`
   */
  async export(password, format2 = "libp2p-key") {
    if (format2 === "libp2p-key") {
      return exporter(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
function unmarshalEd25519PrivateKey(bytes2) {
  if (bytes2.length > PRIVATE_KEY_BYTE_LENGTH) {
    bytes2 = ensureKey(bytes2, PRIVATE_KEY_BYTE_LENGTH + PUBLIC_KEY_BYTE_LENGTH);
    const privateKeyBytes2 = bytes2.subarray(0, PRIVATE_KEY_BYTE_LENGTH);
    const publicKeyBytes2 = bytes2.subarray(PRIVATE_KEY_BYTE_LENGTH, bytes2.length);
    return new Ed25519PrivateKey(privateKeyBytes2, publicKeyBytes2);
  }
  bytes2 = ensureKey(bytes2, PRIVATE_KEY_BYTE_LENGTH);
  const privateKeyBytes = bytes2.subarray(0, PRIVATE_KEY_BYTE_LENGTH);
  const publicKeyBytes = bytes2.subarray(PUBLIC_KEY_BYTE_LENGTH);
  return new Ed25519PrivateKey(privateKeyBytes, publicKeyBytes);
}
function unmarshalEd25519PublicKey(bytes2) {
  bytes2 = ensureKey(bytes2, PUBLIC_KEY_BYTE_LENGTH);
  return new Ed25519PublicKey(bytes2);
}
async function generateKeyPair() {
  const { privateKey, publicKey } = generateKey();
  return new Ed25519PrivateKey(privateKey, publicKey);
}
async function generateKeyPairFromSeed(seed) {
  const { privateKey, publicKey } = generateKeyFromSeed(seed);
  return new Ed25519PrivateKey(privateKey, publicKey);
}
function ensureKey(key, length3) {
  key = Uint8Array.from(key ?? []);
  if (key.length !== length3) {
    throw new CodeError(`Key must be a Uint8Array of length ${length3}, got ${key.length}`, "ERR_INVALID_KEY_TYPE");
  }
  return key;
}

// node_modules/@libp2p/crypto/dist/src/keys/ecdh.js
import crypto4 from "crypto";
var curves = {
  "P-256": "prime256v1",
  "P-384": "secp384r1",
  "P-521": "secp521r1"
};
var curveTypes = Object.keys(curves);
var names = curveTypes.join(" / ");
async function generateEphmeralKeyPair(curve) {
  if (curve !== "P-256" && curve !== "P-384" && curve !== "P-521") {
    throw new CodeError(`Unknown curve: ${curve}. Must be ${names}`, "ERR_INVALID_CURVE");
  }
  const ecdh = crypto4.createECDH(curves[curve]);
  ecdh.generateKeys();
  return {
    key: ecdh.getPublicKey(),
    async genSharedKey(theirPub, forcePrivate) {
      if (forcePrivate != null) {
        ecdh.setPrivateKey(forcePrivate.private);
      }
      return ecdh.computeSecret(theirPub);
    }
  };
}

// node_modules/@libp2p/crypto/dist/src/keys/ephemeral-keys.js
var ephemeral_keys_default = generateEphmeralKeyPair;

// node_modules/@libp2p/crypto/dist/src/keys/importer.js
async function importer(privateKey, password) {
  const encryptedKey = base64.decode(privateKey);
  const cipher = create2();
  return cipher.decrypt(encryptedKey, password);
}

// node_modules/@libp2p/crypto/dist/src/hmac/index.js
import crypto5 from "crypto";

// node_modules/@libp2p/crypto/dist/src/hmac/lengths.js
var lengths_default = {
  SHA1: 20,
  SHA256: 32,
  SHA512: 64
};

// node_modules/@libp2p/crypto/dist/src/hmac/index.js
async function create3(hash2, secret) {
  const res = {
    async digest(data) {
      const hmac2 = crypto5.createHmac(hash2.toLowerCase(), secret);
      hmac2.update(data);
      return hmac2.digest();
    },
    length: lengths_default[hash2]
  };
  return res;
}

// node_modules/@libp2p/crypto/dist/src/keys/key-stretcher.js
var cipherMap = {
  "AES-128": {
    ivSize: 16,
    keySize: 16
  },
  "AES-256": {
    ivSize: 16,
    keySize: 32
  },
  Blowfish: {
    ivSize: 8,
    keySize: 32
  }
};
async function keyStretcher(cipherType, hash2, secret) {
  const cipher = cipherMap[cipherType];
  if (cipher == null) {
    const allowed = Object.keys(cipherMap).join(" / ");
    throw new CodeError(`unknown cipher type '${cipherType}'. Must be ${allowed}`, "ERR_INVALID_CIPHER_TYPE");
  }
  if (hash2 == null) {
    throw new CodeError("missing hash type", "ERR_MISSING_HASH_TYPE");
  }
  const cipherKeySize = cipher.keySize;
  const ivSize = cipher.ivSize;
  const hmacKeySize = 20;
  const seed = fromString2("key expansion");
  const resultLength = 2 * (ivSize + cipherKeySize + hmacKeySize);
  const m = await create3(hash2, secret);
  let a = await m.digest(seed);
  const result = [];
  let j = 0;
  while (j < resultLength) {
    const b = await m.digest(concat([a, seed]));
    let todo = b.length;
    if (j + todo > resultLength) {
      todo = resultLength - j;
    }
    result.push(b);
    j += todo;
    a = await m.digest(a);
  }
  const half = resultLength / 2;
  const resultBuffer = concat(result);
  const r1 = resultBuffer.subarray(0, half);
  const r2 = resultBuffer.subarray(half, resultLength);
  const createKey = (res) => ({
    iv: res.subarray(0, ivSize),
    cipherKey: res.subarray(ivSize, ivSize + cipherKeySize),
    macKey: res.subarray(ivSize + cipherKeySize)
  });
  return {
    k1: createKey(r1),
    k2: createKey(r2)
  };
}

// node_modules/@libp2p/crypto/dist/src/keys/rsa-class.js
var rsa_class_exports = {};
__export(rsa_class_exports, {
  MAX_RSA_KEY_SIZE: () => MAX_RSA_KEY_SIZE,
  RsaPrivateKey: () => RsaPrivateKey,
  RsaPublicKey: () => RsaPublicKey,
  fromJwk: () => fromJwk,
  generateKeyPair: () => generateKeyPair2,
  unmarshalRsaPrivateKey: () => unmarshalRsaPrivateKey,
  unmarshalRsaPublicKey: () => unmarshalRsaPublicKey
});

// node_modules/@libp2p/crypto/dist/src/keys/rsa.js
import crypto7 from "crypto";
import { promisify } from "util";

// node_modules/@noble/hashes/esm/cryptoNode.js
import * as nc from "node:crypto";
var crypto6 = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : void 0;

// node_modules/@noble/hashes/esm/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
var rotr = (word, shift) => word << 32 - shift | word >>> shift;
var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!isLE)
  throw new Error("Non little-endian hardware is not supported");
var nextTick = async () => {
};
async function asyncLoop(iters, tick, cb) {
  let ts = Date.now();
  for (let i = 0; i < iters; i++) {
    cb(i);
    const diff = Date.now() - ts;
    if (diff >= 0 && diff < tick)
      continue;
    await nextTick();
    ts += diff;
  }
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  if (!isBytes(data))
    throw new Error(`expected Uint8Array, got ${typeof data}`);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    if (!isBytes(a))
      throw new Error("Uint8Array expected");
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
var Hash = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
var toStr = {}.toString;
function checkOpts(defaults, opts) {
  if (opts !== void 0 && toStr.call(opts) !== "[object Object]")
    throw new Error("Options should be object or undefined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
function wrapConstructor(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto6 && typeof crypto6.getRandomValues === "function") {
    return crypto6.getRandomValues(new Uint8Array(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}

// node_modules/@libp2p/crypto/dist/src/random-bytes.js
function randomBytes2(length3) {
  if (isNaN(length3) || length3 <= 0) {
    throw new CodeError("random bytes length must be a Number bigger than 0", "ERR_INVALID_LENGTH");
  }
  return randomBytes(length3);
}

// node_modules/@libp2p/crypto/dist/src/keys/rsa-utils.js
var rsa_utils_exports = {};
__export(rsa_utils_exports, {
  exportToPem: () => exportToPem,
  importFromPem: () => importFromPem,
  jwkToPkcs1: () => jwkToPkcs1,
  jwkToPkix: () => jwkToPkix,
  pkcs1ToJwk: () => pkcs1ToJwk,
  pkixToJwk: () => pkixToJwk
});

// node_modules/@noble/hashes/esm/_assert.js
function number(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function isBytes2(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
function bytes(b, ...lengths) {
  if (!isBytes2(b))
    throw new Error("Expected Uint8Array");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash(hash2) {
  if (typeof hash2 !== "function" || typeof hash2.create !== "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  number(hash2.outputLen);
  number(hash2.blockLen);
}
function exists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function output(out, instance) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}

// node_modules/@noble/hashes/esm/hmac.js
var HMAC = class extends Hash {
  constructor(hash2, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash(hash2);
    const key = toBytes(_key);
    this.iHash = hash2.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash2.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash2.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    pad.fill(0);
  }
  update(buf) {
    exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists(this);
    bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = (hash2, key, message2) => new HMAC(hash2, key).update(message2).digest();
hmac.create = (hash2, key) => new HMAC(hash2, key);

// node_modules/@noble/hashes/esm/pbkdf2.js
function pbkdf2Init(hash2, _password, _salt, _opts) {
  hash(hash2);
  const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
  const { c, dkLen, asyncTick } = opts;
  number(c);
  number(dkLen);
  number(asyncTick);
  if (c < 1)
    throw new Error("PBKDF2: iterations (c) should be >= 1");
  const password = toBytes(_password);
  const salt = toBytes(_salt);
  const DK = new Uint8Array(dkLen);
  const PRF = hmac.create(hash2, password);
  const PRFSalt = PRF._cloneInto().update(salt);
  return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
  PRF.destroy();
  PRFSalt.destroy();
  if (prfW)
    prfW.destroy();
  u.fill(0);
  return DK;
}
async function pbkdf2Async(hash2, password, salt, opts) {
  const { c, dkLen, asyncTick, DK, PRF, PRFSalt } = pbkdf2Init(hash2, password, salt, opts);
  let prfW;
  const arr = new Uint8Array(4);
  const view = createView(arr);
  const u = new Uint8Array(PRF.outputLen);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
    const Ti = DK.subarray(pos, pos + PRF.outputLen);
    view.setInt32(0, ti, false);
    (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
    Ti.set(u.subarray(0, Ti.length));
    await asyncLoop(c - 1, asyncTick, () => {
      PRF._cloneInto(prfW).update(u).digestInto(u);
      for (let i = 0; i < Ti.length; i++)
        Ti[i] ^= u[i];
    });
  }
  return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}

// node_modules/@noble/hashes/esm/_sha2.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
var SHA2 = class extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    exists(this);
    const { view, buffer, blockLen } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    exists(this);
    output(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    this.buffer.subarray(pos).fill(0);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length: length3, finished, destroyed, pos } = this;
    to.length = length3;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length3 % blockLen)
      to.buffer.set(buffer);
    return to;
  }
};

// node_modules/@noble/hashes/esm/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i = 0; i < lst.length; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
var rotr32H = (_h, l) => l;
var rotr32L = (h, _l) => h;
var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
var u64 = {
  fromBig,
  split,
  toBig,
  shrSH,
  shrSL,
  rotrSH,
  rotrSL,
  rotrBH,
  rotrBL,
  rotr32H,
  rotr32L,
  rotlSH,
  rotlSL,
  rotlBH,
  rotlBL,
  add,
  add3L,
  add3H,
  add4L,
  add4H,
  add5H,
  add5L
};
var u64_default = u64;

// node_modules/@noble/hashes/esm/sha512.js
var [SHA512_Kh, SHA512_Kl] = /* @__PURE__ */ (() => u64_default.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
var SHA512 = class extends SHA2 {
  constructor() {
    super(128, 64, 16, false);
    this.Ah = 1779033703 | 0;
    this.Al = 4089235720 | 0;
    this.Bh = 3144134277 | 0;
    this.Bl = 2227873595 | 0;
    this.Ch = 1013904242 | 0;
    this.Cl = 4271175723 | 0;
    this.Dh = 2773480762 | 0;
    this.Dl = 1595750129 | 0;
    this.Eh = 1359893119 | 0;
    this.El = 2917565137 | 0;
    this.Fh = 2600822924 | 0;
    this.Fl = 725511199 | 0;
    this.Gh = 528734635 | 0;
    this.Gl = 4215389547 | 0;
    this.Hh = 1541459225 | 0;
    this.Hl = 327033209 | 0;
  }
  // prettier-ignore
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  // prettier-ignore
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view.getUint32(offset);
      SHA512_W_L[i] = view.getUint32(offset += 4);
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = u64_default.rotrSH(W15h, W15l, 1) ^ u64_default.rotrSH(W15h, W15l, 8) ^ u64_default.shrSH(W15h, W15l, 7);
      const s0l = u64_default.rotrSL(W15h, W15l, 1) ^ u64_default.rotrSL(W15h, W15l, 8) ^ u64_default.shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = u64_default.rotrSH(W2h, W2l, 19) ^ u64_default.rotrBH(W2h, W2l, 61) ^ u64_default.shrSH(W2h, W2l, 6);
      const s1l = u64_default.rotrSL(W2h, W2l, 19) ^ u64_default.rotrBL(W2h, W2l, 61) ^ u64_default.shrSL(W2h, W2l, 6);
      const SUMl = u64_default.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = u64_default.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = u64_default.rotrSH(Eh, El, 14) ^ u64_default.rotrSH(Eh, El, 18) ^ u64_default.rotrBH(Eh, El, 41);
      const sigma1l = u64_default.rotrSL(Eh, El, 14) ^ u64_default.rotrSL(Eh, El, 18) ^ u64_default.rotrBL(Eh, El, 41);
      const CHIh = Eh & Fh ^ ~Eh & Gh;
      const CHIl = El & Fl ^ ~El & Gl;
      const T1ll = u64_default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = u64_default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = u64_default.rotrSH(Ah, Al, 28) ^ u64_default.rotrBH(Ah, Al, 34) ^ u64_default.rotrBH(Ah, Al, 39);
      const sigma0l = u64_default.rotrSL(Ah, Al, 28) ^ u64_default.rotrBL(Ah, Al, 34) ^ u64_default.rotrBL(Ah, Al, 39);
      const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
      const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = u64_default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = u64_default.add3L(T1l, sigma0l, MAJl);
      Ah = u64_default.add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = u64_default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = u64_default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = u64_default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = u64_default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = u64_default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = u64_default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = u64_default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = u64_default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    SHA512_W_H.fill(0);
    SHA512_W_L.fill(0);
  }
  destroy() {
    this.buffer.fill(0);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var sha5122 = /* @__PURE__ */ wrapConstructor(() => new SHA512());

// node_modules/@libp2p/crypto/dist/src/keys/rsa-utils.js
var asn1js = __toESM(require_build2(), 1);

// node_modules/@libp2p/crypto/dist/src/webcrypto.js
import { webcrypto as webcrypto2 } from "crypto";
var webcrypto_default = {
  get(win = globalThis) {
    return webcrypto2;
  }
};

// node_modules/@libp2p/crypto/dist/src/keys/rsa-utils.js
function pkcs1ToJwk(bytes2) {
  const { result } = asn1js.fromBER(bytes2);
  const values = result.valueBlock.value;
  const key = {
    n: toString2(bnToBuf(values[1].toBigInt()), "base64url"),
    e: toString2(bnToBuf(values[2].toBigInt()), "base64url"),
    d: toString2(bnToBuf(values[3].toBigInt()), "base64url"),
    p: toString2(bnToBuf(values[4].toBigInt()), "base64url"),
    q: toString2(bnToBuf(values[5].toBigInt()), "base64url"),
    dp: toString2(bnToBuf(values[6].toBigInt()), "base64url"),
    dq: toString2(bnToBuf(values[7].toBigInt()), "base64url"),
    qi: toString2(bnToBuf(values[8].toBigInt()), "base64url"),
    kty: "RSA",
    alg: "RS256"
  };
  return key;
}
function jwkToPkcs1(jwk) {
  if (jwk.n == null || jwk.e == null || jwk.d == null || jwk.p == null || jwk.q == null || jwk.dp == null || jwk.dq == null || jwk.qi == null) {
    throw new CodeError("JWK was missing components", "ERR_INVALID_PARAMETERS");
  }
  const root = new asn1js.Sequence({
    value: [
      new asn1js.Integer({ value: 0 }),
      asn1js.Integer.fromBigInt(bufToBn(fromString2(jwk.n, "base64url"))),
      asn1js.Integer.fromBigInt(bufToBn(fromString2(jwk.e, "base64url"))),
      asn1js.Integer.fromBigInt(bufToBn(fromString2(jwk.d, "base64url"))),
      asn1js.Integer.fromBigInt(bufToBn(fromString2(jwk.p, "base64url"))),
      asn1js.Integer.fromBigInt(bufToBn(fromString2(jwk.q, "base64url"))),
      asn1js.Integer.fromBigInt(bufToBn(fromString2(jwk.dp, "base64url"))),
      asn1js.Integer.fromBigInt(bufToBn(fromString2(jwk.dq, "base64url"))),
      asn1js.Integer.fromBigInt(bufToBn(fromString2(jwk.qi, "base64url")))
    ]
  });
  const der = root.toBER();
  return new Uint8Array(der, 0, der.byteLength);
}
function pkixToJwk(bytes2) {
  const { result } = asn1js.fromBER(bytes2);
  const values = result.valueBlock.value[1].valueBlock.value[0].valueBlock.value;
  return {
    kty: "RSA",
    n: toString2(bnToBuf(values[0].toBigInt()), "base64url"),
    e: toString2(bnToBuf(values[1].toBigInt()), "base64url")
  };
}
function jwkToPkix(jwk) {
  if (jwk.n == null || jwk.e == null) {
    throw new CodeError("JWK was missing components", "ERR_INVALID_PARAMETERS");
  }
  const root = new asn1js.Sequence({
    value: [
      new asn1js.Sequence({
        value: [
          // rsaEncryption
          new asn1js.ObjectIdentifier({
            value: "1.2.840.113549.1.1.1"
          }),
          new asn1js.Null()
        ]
      }),
      // this appears to be a bug in asn1js.js - this should really be a Sequence
      // and not a BitString but it generates the same bytes as node-forge so 🤷‍♂️
      new asn1js.BitString({
        valueHex: new asn1js.Sequence({
          value: [
            asn1js.Integer.fromBigInt(bufToBn(fromString2(jwk.n, "base64url"))),
            asn1js.Integer.fromBigInt(bufToBn(fromString2(jwk.e, "base64url")))
          ]
        }).toBER()
      })
    ]
  });
  const der = root.toBER();
  return new Uint8Array(der, 0, der.byteLength);
}
function bnToBuf(bn) {
  let hex = bn.toString(16);
  if (hex.length % 2 > 0) {
    hex = `0${hex}`;
  }
  const len = hex.length / 2;
  const u8 = new Uint8Array(len);
  let i = 0;
  let j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }
  return u8;
}
function bufToBn(u8) {
  const hex = [];
  u8.forEach(function(i) {
    let h = i.toString(16);
    if (h.length % 2 > 0) {
      h = `0${h}`;
    }
    hex.push(h);
  });
  return BigInt("0x" + hex.join(""));
}
var SALT_LENGTH = 16;
var KEY_SIZE = 32;
var ITERATIONS = 1e4;
async function exportToPem(privateKey, password) {
  const crypto9 = webcrypto_default.get();
  const keyWrapper = new asn1js.Sequence({
    value: [
      // version (0)
      new asn1js.Integer({ value: 0 }),
      // privateKeyAlgorithm
      new asn1js.Sequence({
        value: [
          // rsaEncryption OID
          new asn1js.ObjectIdentifier({
            value: "1.2.840.113549.1.1.1"
          }),
          new asn1js.Null()
        ]
      }),
      // PrivateKey
      new asn1js.OctetString({
        valueHex: privateKey.marshal()
      })
    ]
  });
  const keyBuf = keyWrapper.toBER();
  const keyArr = new Uint8Array(keyBuf, 0, keyBuf.byteLength);
  const salt = randomBytes2(SALT_LENGTH);
  const encryptionKey = await pbkdf2Async(sha5122, password, salt, {
    c: ITERATIONS,
    dkLen: KEY_SIZE
  });
  const iv = randomBytes2(16);
  const cryptoKey = await crypto9.subtle.importKey("raw", encryptionKey, "AES-CBC", false, ["encrypt"]);
  const encrypted = await crypto9.subtle.encrypt({
    name: "AES-CBC",
    iv
  }, cryptoKey, keyArr);
  const pbkdf2Params = new asn1js.Sequence({
    value: [
      // salt
      new asn1js.OctetString({ valueHex: salt }),
      // iteration count
      new asn1js.Integer({ value: ITERATIONS }),
      // key length
      new asn1js.Integer({ value: KEY_SIZE }),
      // AlgorithmIdentifier
      new asn1js.Sequence({
        value: [
          // hmacWithSHA512
          new asn1js.ObjectIdentifier({ value: "1.2.840.113549.2.11" }),
          new asn1js.Null()
        ]
      })
    ]
  });
  const encryptionAlgorithm = new asn1js.Sequence({
    value: [
      // pkcs5PBES2
      new asn1js.ObjectIdentifier({
        value: "1.2.840.113549.1.5.13"
      }),
      new asn1js.Sequence({
        value: [
          // keyDerivationFunc
          new asn1js.Sequence({
            value: [
              // pkcs5PBKDF2
              new asn1js.ObjectIdentifier({
                value: "1.2.840.113549.1.5.12"
              }),
              // PBKDF2-params
              pbkdf2Params
            ]
          }),
          // encryptionScheme
          new asn1js.Sequence({
            value: [
              // aes256-CBC
              new asn1js.ObjectIdentifier({
                value: "2.16.840.1.101.3.4.1.42"
              }),
              // iv
              new asn1js.OctetString({
                valueHex: iv
              })
            ]
          })
        ]
      })
    ]
  });
  const finalWrapper = new asn1js.Sequence({
    value: [
      encryptionAlgorithm,
      new asn1js.OctetString({ valueHex: encrypted })
    ]
  });
  const finalWrapperBuf = finalWrapper.toBER();
  const finalWrapperArr = new Uint8Array(finalWrapperBuf, 0, finalWrapperBuf.byteLength);
  return [
    "-----BEGIN ENCRYPTED PRIVATE KEY-----",
    ...toString2(finalWrapperArr, "base64pad").split(/(.{64})/).filter(Boolean),
    "-----END ENCRYPTED PRIVATE KEY-----"
  ].join("\n");
}
async function importFromPem(pem, password) {
  const crypto9 = webcrypto_default.get();
  let plaintext;
  if (pem.includes("-----BEGIN ENCRYPTED PRIVATE KEY-----")) {
    const key = fromString2(pem.replace("-----BEGIN ENCRYPTED PRIVATE KEY-----", "").replace("-----END ENCRYPTED PRIVATE KEY-----", "").replace(/\n/g, "").trim(), "base64pad");
    const { result } = asn1js.fromBER(key);
    const { iv, salt, iterations, keySize: keySize2, cipherText } = findEncryptedPEMData(result);
    const encryptionKey = await pbkdf2Async(sha5122, password, salt, {
      c: iterations,
      dkLen: keySize2
    });
    const cryptoKey = await crypto9.subtle.importKey("raw", encryptionKey, "AES-CBC", false, ["decrypt"]);
    const decrypted = toUint8Array(await crypto9.subtle.decrypt({
      name: "AES-CBC",
      iv
    }, cryptoKey, cipherText));
    const { result: decryptedResult } = asn1js.fromBER(decrypted);
    plaintext = findPEMData(decryptedResult);
  } else if (pem.includes("-----BEGIN PRIVATE KEY-----")) {
    const key = fromString2(pem.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replace(/\n/g, "").trim(), "base64pad");
    const { result } = asn1js.fromBER(key);
    plaintext = findPEMData(result);
  } else {
    throw new CodeError("Could not parse private key from PEM data", "ERR_INVALID_PARAMETERS");
  }
  return unmarshalRsaPrivateKey(plaintext);
}
function findEncryptedPEMData(root) {
  const encryptionAlgorithm = root.valueBlock.value[0];
  const scheme = encryptionAlgorithm.valueBlock.value[0].toString();
  if (scheme !== "OBJECT IDENTIFIER : 1.2.840.113549.1.5.13") {
    throw new CodeError("Only pkcs5PBES2 encrypted private keys are supported", "ERR_INVALID_PARAMS");
  }
  const keyDerivationFunc = encryptionAlgorithm.valueBlock.value[1].valueBlock.value[0];
  const keyDerivationFuncName = keyDerivationFunc.valueBlock.value[0].toString();
  if (keyDerivationFuncName !== "OBJECT IDENTIFIER : 1.2.840.113549.1.5.12") {
    throw new CodeError("Only pkcs5PBKDF2 key derivation functions are supported", "ERR_INVALID_PARAMS");
  }
  const pbkdf2Params = keyDerivationFunc.valueBlock.value[1];
  const salt = toUint8Array(pbkdf2Params.valueBlock.value[0].getValue());
  let iterations = ITERATIONS;
  let keySize2 = KEY_SIZE;
  if (pbkdf2Params.valueBlock.value.length === 3) {
    iterations = Number(pbkdf2Params.valueBlock.value[1].toBigInt());
    keySize2 = Number(pbkdf2Params.valueBlock.value[2].toBigInt());
  } else if (pbkdf2Params.valueBlock.value.length === 2) {
    throw new CodeError("Could not derive key size and iterations from PEM file - please use @libp2p/rsa to re-import your key", "ERR_INVALID_PARAMS");
  }
  const encryptionScheme = encryptionAlgorithm.valueBlock.value[1].valueBlock.value[1];
  const encryptionSchemeName = encryptionScheme.valueBlock.value[0].toString();
  if (encryptionSchemeName === "OBJECT IDENTIFIER : 1.2.840.113549.3.7") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 1.3.14.3.2.7") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.2") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.22") {
  } else if (encryptionSchemeName === "OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.42") {
  } else {
    throw new CodeError("Only AES-CBC encryption schemes are supported", "ERR_INVALID_PARAMS");
  }
  const iv = toUint8Array(encryptionScheme.valueBlock.value[1].getValue());
  return {
    cipherText: toUint8Array(root.valueBlock.value[1].getValue()),
    salt,
    iterations,
    keySize: keySize2,
    iv
  };
}
function findPEMData(seq) {
  return toUint8Array(seq.valueBlock.value[2].getValue());
}
function toUint8Array(buf) {
  return new Uint8Array(buf, 0, buf.byteLength);
}

// node_modules/@libp2p/crypto/dist/src/keys/rsa.js
var keypair2 = promisify(crypto7.generateKeyPair);
async function generateKey2(bits) {
  const key = await keypair2("rsa", {
    modulusLength: bits,
    publicKeyEncoding: { type: "pkcs1", format: "jwk" },
    privateKeyEncoding: { type: "pkcs1", format: "jwk" }
  });
  return {
    // @ts-expect-error node types are missing jwk as a format
    privateKey: key.privateKey,
    // @ts-expect-error node types are missing jwk as a format
    publicKey: key.publicKey
  };
}
async function unmarshalPrivateKey(key) {
  if (key == null) {
    throw new CodeError("Missing key parameter", "ERR_MISSING_KEY");
  }
  return {
    privateKey: key,
    publicKey: {
      kty: key.kty,
      n: key.n,
      e: key.e
    }
  };
}
async function hashAndSign2(key, msg) {
  const hash2 = crypto7.createSign("RSA-SHA256");
  if (msg instanceof Uint8Array) {
    hash2.update(msg);
  } else {
    for (const buf of msg) {
      hash2.update(buf);
    }
  }
  return hash2.sign({ format: "jwk", key });
}
async function hashAndVerify2(key, sig, msg) {
  const hash2 = crypto7.createVerify("RSA-SHA256");
  if (msg instanceof Uint8Array) {
    hash2.update(msg);
  } else {
    for (const buf of msg) {
      hash2.update(buf);
    }
  }
  return hash2.verify({ format: "jwk", key }, sig);
}
function keySize(jwk) {
  if (jwk.kty !== "RSA") {
    throw new CodeError("invalid key type", "ERR_INVALID_KEY_TYPE");
  } else if (jwk.n == null) {
    throw new CodeError("invalid key modulus", "ERR_INVALID_KEY_MODULUS");
  }
  const modulus = fromString2(jwk.n, "base64url");
  return modulus.length * 8;
}

// node_modules/@libp2p/crypto/dist/src/keys/rsa-class.js
var MAX_RSA_KEY_SIZE = 8192;
var RsaPublicKey = class {
  _key;
  constructor(key) {
    this._key = key;
  }
  verify(data, sig) {
    return hashAndVerify2(this._key, sig, data);
  }
  marshal() {
    return rsa_utils_exports.jwkToPkix(this._key);
  }
  get bytes() {
    return PublicKey.encode({
      Type: KeyType.RSA,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
};
var RsaPrivateKey = class {
  _key;
  _publicKey;
  constructor(key, publicKey) {
    this._key = key;
    this._publicKey = publicKey;
  }
  genSecret() {
    return randomBytes2(16);
  }
  sign(message2) {
    return hashAndSign2(this._key, message2);
  }
  get public() {
    if (this._publicKey == null) {
      throw new CodeError("public key not provided", "ERR_PUBKEY_NOT_PROVIDED");
    }
    return new RsaPublicKey(this._publicKey);
  }
  marshal() {
    return rsa_utils_exports.jwkToPkcs1(this._key);
  }
  get bytes() {
    return PrivateKey.encode({
      Type: KeyType.RSA,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the SHA-256 multihash of its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   */
  async id() {
    const hash2 = await this.public.hash();
    return toString2(hash2, "base58btc");
  }
  /**
   * Exports the key as libp2p-key - a aes-gcm encrypted value with the key
   * derived from the password.
   *
   * To export it as a password protected PEM file, please use the `exportPEM`
   * function from `@libp2p/rsa`.
   */
  async export(password, format2 = "pkcs-8") {
    if (format2 === "pkcs-8") {
      return rsa_utils_exports.exportToPem(this, password);
    } else if (format2 === "libp2p-key") {
      return exporter(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
async function unmarshalRsaPrivateKey(bytes2) {
  const jwk = rsa_utils_exports.pkcs1ToJwk(bytes2);
  if (keySize(jwk) > MAX_RSA_KEY_SIZE) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await unmarshalPrivateKey(jwk);
  return new RsaPrivateKey(keys.privateKey, keys.publicKey);
}
function unmarshalRsaPublicKey(bytes2) {
  const jwk = rsa_utils_exports.pkixToJwk(bytes2);
  if (keySize(jwk) > MAX_RSA_KEY_SIZE) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  return new RsaPublicKey(jwk);
}
async function fromJwk(jwk) {
  if (keySize(jwk) > MAX_RSA_KEY_SIZE) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await unmarshalPrivateKey(jwk);
  return new RsaPrivateKey(keys.privateKey, keys.publicKey);
}
async function generateKeyPair2(bits) {
  if (bits > MAX_RSA_KEY_SIZE) {
    throw new CodeError("key size is too large", "ERR_KEY_SIZE_TOO_LARGE");
  }
  const keys = await generateKey2(bits);
  return new RsaPrivateKey(keys.privateKey, keys.publicKey);
}

// node_modules/@libp2p/crypto/dist/src/keys/secp256k1-class.js
var secp256k1_class_exports = {};
__export(secp256k1_class_exports, {
  Secp256k1PrivateKey: () => Secp256k1PrivateKey,
  Secp256k1PublicKey: () => Secp256k1PublicKey,
  generateKeyPair: () => generateKeyPair3,
  unmarshalSecp256k1PrivateKey: () => unmarshalSecp256k1PrivateKey,
  unmarshalSecp256k1PublicKey: () => unmarshalSecp256k1PublicKey
});

// node_modules/@libp2p/crypto/dist/src/keys/secp256k1.js
import crypto8 from "node:crypto";

// node_modules/@noble/hashes/esm/sha256.js
var Chi = (a, b, c) => a & b ^ ~a & c;
var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
var SHA256_K = /* @__PURE__ */ new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var IV = /* @__PURE__ */ new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends SHA2 {
  constructor() {
    super(64, 32, 8, false);
    this.A = IV[0] | 0;
    this.B = IV[1] | 0;
    this.C = IV[2] | 0;
    this.D = IV[3] | 0;
    this.E = IV[4] | 0;
    this.F = IV[5] | 0;
    this.G = IV[6] | 0;
    this.H = IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
};
var sha2562 = /* @__PURE__ */ wrapConstructor(() => new SHA256());

// node_modules/@noble/curves/esm/abstract/utils.js
var utils_exports = {};
__export(utils_exports, {
  bitGet: () => bitGet,
  bitLen: () => bitLen,
  bitMask: () => bitMask,
  bitSet: () => bitSet,
  bytesToHex: () => bytesToHex,
  bytesToNumberBE: () => bytesToNumberBE,
  bytesToNumberLE: () => bytesToNumberLE,
  concatBytes: () => concatBytes2,
  createHmacDrbg: () => createHmacDrbg,
  ensureBytes: () => ensureBytes,
  equalBytes: () => equalBytes,
  hexToBytes: () => hexToBytes,
  hexToNumber: () => hexToNumber,
  isBytes: () => isBytes3,
  numberToBytesBE: () => numberToBytesBE,
  numberToBytesLE: () => numberToBytesLE,
  numberToHexUnpadded: () => numberToHexUnpadded,
  numberToVarBytesBE: () => numberToVarBytesBE,
  utf8ToBytes: () => utf8ToBytes2,
  validateObject: () => validateObject
});
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
function isBytes3(a) {
  return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
}
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes2) {
  if (!isBytes3(bytes2))
    throw new Error("Uint8Array expected");
  let hex = "";
  for (let i = 0; i < bytes2.length; i++) {
    hex += hexes[bytes2[i]];
  }
  return hex;
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return BigInt(hex === "" ? "0" : `0x${hex}`);
}
var asciis = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
function asciiToBase16(char) {
  if (char >= asciis._0 && char <= asciis._9)
    return char - asciis._0;
  if (char >= asciis._A && char <= asciis._F)
    return char - (asciis._A - 10);
  if (char >= asciis._a && char <= asciis._f)
    return char - (asciis._a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("padded hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function bytesToNumberBE(bytes2) {
  return hexToNumber(bytesToHex(bytes2));
}
function bytesToNumberLE(bytes2) {
  if (!isBytes3(bytes2))
    throw new Error("Uint8Array expected");
  return hexToNumber(bytesToHex(Uint8Array.from(bytes2).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function numberToVarBytesBE(n) {
  return hexToBytes(numberToHexUnpadded(n));
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
    }
  } else if (isBytes3(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(`${title} must be hex string or Uint8Array`);
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
  return res;
}
function concatBytes2(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    if (!isBytes3(a))
      throw new Error("Uint8Array expected");
    sum += a.length;
  }
  let res = new Uint8Array(sum);
  let pad = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
function equalBytes(a, b) {
  if (a.length !== b.length)
    return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++)
    diff |= a[i] ^ b[i];
  return diff === 0;
}
function utf8ToBytes2(str) {
  if (typeof str !== "string")
    throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str));
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
function bitGet(n, pos) {
  return n >> BigInt(pos) & _1n;
}
var bitSet = (n, pos, value) => {
  return n | (value ? _1n : _0n) << BigInt(pos);
};
var bitMask = (n) => (_2n << BigInt(n - 1)) - _1n;
var u8n = (data) => new Uint8Array(data);
var u8fr = (arr) => Uint8Array.from(arr);
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b);
  const reseed = (seed = u8n()) => {
    k = h(u8fr([0]), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8fr([1]), seed);
    v = h();
  };
  const gen = () => {
    if (i++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen())))
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
var validatorFns = {
  bigint: (val) => typeof val === "bigint",
  function: (val) => typeof val === "function",
  boolean: (val) => typeof val === "boolean",
  string: (val) => typeof val === "string",
  stringOrUint8Array: (val) => typeof val === "string" || isBytes3(val),
  isSafeInteger: (val) => Number.isSafeInteger(val),
  array: (val) => Array.isArray(val),
  field: (val, object) => object.Fp.isValid(val),
  hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
};
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error(`Invalid validator "${type}", expected function`);
    const val = object[fieldName];
    if (isOptional && val === void 0)
      return;
    if (!checkVal(val, object)) {
      throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
    }
  };
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object;
}

// node_modules/@noble/curves/esm/abstract/modular.js
var _0n2 = BigInt(0);
var _1n2 = BigInt(1);
var _2n2 = BigInt(2);
var _3n = BigInt(3);
var _4n = BigInt(4);
var _5n = BigInt(5);
var _8n = BigInt(8);
var _9n = BigInt(9);
var _16n = BigInt(16);
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow(num, power, modulo) {
  if (modulo <= _0n2 || power < _0n2)
    throw new Error("Expected power/modulo > 0");
  if (modulo === _1n2)
    return _0n2;
  let res = _1n2;
  while (power > _0n2) {
    if (power & _1n2)
      res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n2;
  }
  return res;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number2, modulo) {
  if (number2 === _0n2 || modulo <= _0n2) {
    throw new Error(`invert: expected positive integers, got n=${number2} mod=${modulo}`);
  }
  let a = mod(number2, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd = b;
  if (gcd !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function tonelliShanks(P) {
  const legendreC = (P - _1n2) / _2n2;
  let Q, S, Z;
  for (Q = P - _1n2, S = 0; Q % _2n2 === _0n2; Q /= _2n2, S++)
    ;
  for (Z = _2n2; Z < P && pow(Z, legendreC, P) !== P - _1n2; Z++)
    ;
  if (S === 1) {
    const p1div4 = (P + _1n2) / _4n;
    return function tonelliFast(Fp2, n) {
      const root = Fp2.pow(n, p1div4);
      if (!Fp2.eql(Fp2.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  const Q1div2 = (Q + _1n2) / _2n2;
  return function tonelliSlow(Fp2, n) {
    if (Fp2.pow(n, legendreC) === Fp2.neg(Fp2.ONE))
      throw new Error("Cannot find square root");
    let r = S;
    let g = Fp2.pow(Fp2.mul(Fp2.ONE, Z), Q);
    let x = Fp2.pow(n, Q1div2);
    let b = Fp2.pow(n, Q);
    while (!Fp2.eql(b, Fp2.ONE)) {
      if (Fp2.eql(b, Fp2.ZERO))
        return Fp2.ZERO;
      let m = 1;
      for (let t2 = Fp2.sqr(b); m < r; m++) {
        if (Fp2.eql(t2, Fp2.ONE))
          break;
        t2 = Fp2.sqr(t2);
      }
      const ge = Fp2.pow(g, _1n2 << BigInt(r - m - 1));
      g = Fp2.sqr(ge);
      x = Fp2.mul(x, ge);
      b = Fp2.mul(b, g);
      r = m;
    }
    return x;
  };
}
function FpSqrt(P) {
  if (P % _4n === _3n) {
    const p1div4 = (P + _1n2) / _4n;
    return function sqrt3mod4(Fp2, n) {
      const root = Fp2.pow(n, p1div4);
      if (!Fp2.eql(Fp2.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _8n === _5n) {
    const c1 = (P - _5n) / _8n;
    return function sqrt5mod8(Fp2, n) {
      const n2 = Fp2.mul(n, _2n2);
      const v = Fp2.pow(n2, c1);
      const nv = Fp2.mul(n, v);
      const i = Fp2.mul(Fp2.mul(nv, _2n2), v);
      const root = Fp2.mul(nv, Fp2.sub(i, Fp2.ONE));
      if (!Fp2.eql(Fp2.sqr(root), n))
        throw new Error("Cannot find square root");
      return root;
    };
  }
  if (P % _16n === _9n) {
  }
  return tonelliShanks(P);
}
var FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN"
];
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject(field, opts);
}
function FpPow(f, num, power) {
  if (power < _0n2)
    throw new Error("Expected power > 0");
  if (power === _0n2)
    return f.ONE;
  if (power === _1n2)
    return num;
  let p = f.ONE;
  let d = num;
  while (power > _0n2) {
    if (power & _1n2)
      p = f.mul(p, d);
    d = f.sqr(d);
    power >>= _1n2;
  }
  return p;
}
function FpInvertBatch(f, nums) {
  const tmp = new Array(nums.length);
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = acc;
    return f.mul(acc, num);
  }, f.ONE);
  const inverted = f.inv(lastMultiplied);
  nums.reduceRight((acc, num, i) => {
    if (f.is0(num))
      return acc;
    tmp[i] = f.mul(acc, tmp[i]);
    return f.mul(acc, num);
  }, inverted);
  return tmp;
}
function nLength(n, nBitLength) {
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
  if (ORDER <= _0n2)
    throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("Field lengths over 2048 bytes are not supported");
  const sqrtP = FpSqrt(ORDER);
  const f = Object.freeze({
    ORDER,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n2,
    ONE: _1n2,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
      return _0n2 <= num && num < ORDER;
    },
    is0: (num) => num === _0n2,
    isOdd: (num) => (num & _1n2) === _1n2,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: redef.sqrt || ((n) => sqrtP(f, n)),
    invertBatch: (lst) => FpInvertBatch(f, lst),
    // TODO: do we really need constant cmov?
    // We don't have const-time bigints anyway, so probably will be not very useful
    cmov: (a, b, c) => c ? b : a,
    toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes2) => {
      if (bytes2.length !== BYTES)
        throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes2.length}`);
      return isLE2 ? bytesToNumberLE(bytes2) : bytesToNumberBE(bytes2);
    }
  });
  return Object.freeze(f);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length3 = getFieldBytesLength(fieldOrder);
  return length3 + Math.ceil(length3 / 2);
}
function mapHashToField(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
  const num = isLE2 ? bytesToNumberBE(key) : bytesToNumberLE(key);
  const reduced = mod(num, fieldOrder - _1n2) + _1n2;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}

// node_modules/@noble/curves/esm/abstract/curve.js
var _0n3 = BigInt(0);
var _1n3 = BigInt(1);
function wNAF(c, bits) {
  const constTimeNegate = (condition, item) => {
    const neg = item.negate();
    return condition ? neg : item;
  };
  const opts = (W) => {
    const windows = Math.ceil(bits / W) + 1;
    const windowSize = 2 ** (W - 1);
    return { windows, windowSize };
  };
  return {
    constTimeNegate,
    // non-const time multiplication ladder
    unsafeLadder(elm, n) {
      let p = c.ZERO;
      let d = elm;
      while (n > _0n3) {
        if (n & _1n3)
          p = p.add(d);
        d = d.double();
        n >>= _1n3;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = opts(W);
      const points = [];
      let p = elm;
      let base3 = p;
      for (let window = 0; window < windows; window++) {
        base3 = p;
        points.push(base3);
        for (let i = 1; i < windowSize; i++) {
          base3 = base3.add(p);
          points.push(base3);
        }
        p = base3.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      const { windows, windowSize } = opts(W);
      let p = c.ZERO;
      let f = c.BASE;
      const mask = BigInt(2 ** W - 1);
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window = 0; window < windows; window++) {
        const offset = window * windowSize;
        let wbits = Number(n & mask);
        n >>= shiftBy;
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n3;
        }
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1;
        const cond1 = window % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          f = f.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      return { p, f };
    },
    wNAFCached(P, precomputesMap, n, transform) {
      const W = P._WINDOW_SIZE || 1;
      let comp = precomputesMap.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1) {
          precomputesMap.set(P, transform(comp));
        }
      }
      return this.wNAF(W, comp, n);
    }
  };
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}

// node_modules/@noble/curves/esm/abstract/weierstrass.js
function validatePointOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    a: "field",
    b: "field"
  }, {
    allowedPrivateKeyLengths: "array",
    wrapPrivateKey: "boolean",
    isTorsionFree: "function",
    clearCofactor: "function",
    allowInfinityPoint: "boolean",
    fromBytes: "function",
    toBytes: "function"
  });
  const { endo, Fp: Fp2, a } = opts;
  if (endo) {
    if (!Fp2.eql(a, Fp2.ZERO)) {
      throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
    }
    if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error("Expected endomorphism with beta: bigint and splitScalar: function");
    }
  }
  return Object.freeze({ ...opts });
}
var { bytesToNumberBE: b2n, hexToBytes: h2b } = utils_exports;
var DER = {
  // asn.1 DER encoding utils
  Err: class DERErr extends Error {
    constructor(m = "") {
      super(m);
    }
  },
  _parseInt(data) {
    const { Err: E } = DER;
    if (data.length < 2 || data[0] !== 2)
      throw new E("Invalid signature integer tag");
    const len = data[1];
    const res = data.subarray(2, len + 2);
    if (!len || res.length !== len)
      throw new E("Invalid signature integer: wrong length");
    if (res[0] & 128)
      throw new E("Invalid signature integer: negative");
    if (res[0] === 0 && !(res[1] & 128))
      throw new E("Invalid signature integer: unnecessary leading zero");
    return { d: b2n(res), l: data.subarray(len + 2) };
  },
  toSig(hex) {
    const { Err: E } = DER;
    const data = typeof hex === "string" ? h2b(hex) : hex;
    if (!isBytes3(data))
      throw new Error("ui8a expected");
    let l = data.length;
    if (l < 2 || data[0] != 48)
      throw new E("Invalid signature tag");
    if (data[1] !== l - 2)
      throw new E("Invalid signature: incorrect length");
    const { d: r, l: sBytes } = DER._parseInt(data.subarray(2));
    const { d: s, l: rBytesLeft } = DER._parseInt(sBytes);
    if (rBytesLeft.length)
      throw new E("Invalid signature: left bytes after parsing");
    return { r, s };
  },
  hexFromSig(sig) {
    const slice = (s2) => Number.parseInt(s2[0], 16) & 8 ? "00" + s2 : s2;
    const h = (num) => {
      const hex = num.toString(16);
      return hex.length & 1 ? `0${hex}` : hex;
    };
    const s = slice(h(sig.s));
    const r = slice(h(sig.r));
    const shl = s.length / 2;
    const rhl = r.length / 2;
    const sl = h(shl);
    const rl = h(rhl);
    return `30${h(rhl + shl + 4)}02${rl}${r}02${sl}${s}`;
  }
};
var _0n4 = BigInt(0);
var _1n4 = BigInt(1);
var _2n3 = BigInt(2);
var _3n2 = BigInt(3);
var _4n2 = BigInt(4);
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const { Fp: Fp2 } = CURVE;
  const toBytes2 = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes2(Uint8Array.from([4]), Fp2.toBytes(a.x), Fp2.toBytes(a.y));
  });
  const fromBytes = CURVE.fromBytes || ((bytes2) => {
    const tail = bytes2.subarray(1);
    const x = Fp2.fromBytes(tail.subarray(0, Fp2.BYTES));
    const y = Fp2.fromBytes(tail.subarray(Fp2.BYTES, 2 * Fp2.BYTES));
    return { x, y };
  });
  function weierstrassEquation(x) {
    const { a, b } = CURVE;
    const x2 = Fp2.sqr(x);
    const x3 = Fp2.mul(x2, x);
    return Fp2.add(Fp2.add(x3, Fp2.mul(x, a)), b);
  }
  if (!Fp2.eql(Fp2.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx)))
    throw new Error("bad generator point: equation left != right");
  function isWithinCurveOrder(num) {
    return typeof num === "bigint" && _0n4 < num && num < CURVE.n;
  }
  function assertGE(num) {
    if (!isWithinCurveOrder(num))
      throw new Error("Expected valid bigint: 0 < bigint < curve.n");
  }
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (isBytes3(key))
        key = bytesToHex(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("Invalid key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
    } catch (error) {
      throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
    }
    if (wrapPrivateKey)
      num = mod(num, n);
    assertGE(num);
    return num;
  }
  const pointPrecomputes = /* @__PURE__ */ new Map();
  function assertPrjPoint(other) {
    if (!(other instanceof Point2))
      throw new Error("ProjectivePoint expected");
  }
  class Point2 {
    constructor(px, py, pz) {
      this.px = px;
      this.py = py;
      this.pz = pz;
      if (px == null || !Fp2.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp2.isValid(py))
        throw new Error("y required");
      if (pz == null || !Fp2.isValid(pz))
        throw new Error("z required");
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp2.isValid(x) || !Fp2.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point2)
        throw new Error("projective point not allowed");
      const is0 = (i) => Fp2.eql(i, Fp2.ZERO);
      if (is0(x) && is0(y))
        return Point2.ZERO;
      return new Point2(x, y, Fp2.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(points) {
      const toInv = Fp2.invertBatch(points.map((p) => p.pz));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point2.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(hex) {
      const P = Point2.fromAffine(fromBytes(ensureBytes("pointHex", hex)));
      P.assertValidity();
      return P;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(privateKey) {
      return Point2.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      this._WINDOW_SIZE = windowSize;
      pointPrecomputes.delete(this);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      if (this.is0()) {
        if (CURVE.allowInfinityPoint && !Fp2.is0(this.py))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = this.toAffine();
      if (!Fp2.isValid(x) || !Fp2.isValid(y))
        throw new Error("bad point: x or y not FE");
      const left = Fp2.sqr(y);
      const right = weierstrassEquation(x);
      if (!Fp2.eql(left, right))
        throw new Error("bad point: equation left != right");
      if (!this.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (Fp2.isOdd)
        return !Fp2.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp2.eql(Fp2.mul(X1, Z2), Fp2.mul(X2, Z1));
      const U2 = Fp2.eql(Fp2.mul(Y1, Z2), Fp2.mul(Y2, Z1));
      return U1 && U2;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new Point2(this.px, Fp2.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp2.mul(b, _3n2);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let X3 = Fp2.ZERO, Y3 = Fp2.ZERO, Z3 = Fp2.ZERO;
      let t0 = Fp2.mul(X1, X1);
      let t1 = Fp2.mul(Y1, Y1);
      let t2 = Fp2.mul(Z1, Z1);
      let t3 = Fp2.mul(X1, Y1);
      t3 = Fp2.add(t3, t3);
      Z3 = Fp2.mul(X1, Z1);
      Z3 = Fp2.add(Z3, Z3);
      X3 = Fp2.mul(a, Z3);
      Y3 = Fp2.mul(b3, t2);
      Y3 = Fp2.add(X3, Y3);
      X3 = Fp2.sub(t1, Y3);
      Y3 = Fp2.add(t1, Y3);
      Y3 = Fp2.mul(X3, Y3);
      X3 = Fp2.mul(t3, X3);
      Z3 = Fp2.mul(b3, Z3);
      t2 = Fp2.mul(a, t2);
      t3 = Fp2.sub(t0, t2);
      t3 = Fp2.mul(a, t3);
      t3 = Fp2.add(t3, Z3);
      Z3 = Fp2.add(t0, t0);
      t0 = Fp2.add(Z3, t0);
      t0 = Fp2.add(t0, t2);
      t0 = Fp2.mul(t0, t3);
      Y3 = Fp2.add(Y3, t0);
      t2 = Fp2.mul(Y1, Z1);
      t2 = Fp2.add(t2, t2);
      t0 = Fp2.mul(t2, t3);
      X3 = Fp2.sub(X3, t0);
      Z3 = Fp2.mul(t2, t1);
      Z3 = Fp2.add(Z3, Z3);
      Z3 = Fp2.add(Z3, Z3);
      return new Point2(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      assertPrjPoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let X3 = Fp2.ZERO, Y3 = Fp2.ZERO, Z3 = Fp2.ZERO;
      const a = CURVE.a;
      const b3 = Fp2.mul(CURVE.b, _3n2);
      let t0 = Fp2.mul(X1, X2);
      let t1 = Fp2.mul(Y1, Y2);
      let t2 = Fp2.mul(Z1, Z2);
      let t3 = Fp2.add(X1, Y1);
      let t4 = Fp2.add(X2, Y2);
      t3 = Fp2.mul(t3, t4);
      t4 = Fp2.add(t0, t1);
      t3 = Fp2.sub(t3, t4);
      t4 = Fp2.add(X1, Z1);
      let t5 = Fp2.add(X2, Z2);
      t4 = Fp2.mul(t4, t5);
      t5 = Fp2.add(t0, t2);
      t4 = Fp2.sub(t4, t5);
      t5 = Fp2.add(Y1, Z1);
      X3 = Fp2.add(Y2, Z2);
      t5 = Fp2.mul(t5, X3);
      X3 = Fp2.add(t1, t2);
      t5 = Fp2.sub(t5, X3);
      Z3 = Fp2.mul(a, t4);
      X3 = Fp2.mul(b3, t2);
      Z3 = Fp2.add(X3, Z3);
      X3 = Fp2.sub(t1, Z3);
      Z3 = Fp2.add(t1, Z3);
      Y3 = Fp2.mul(X3, Z3);
      t1 = Fp2.add(t0, t0);
      t1 = Fp2.add(t1, t0);
      t2 = Fp2.mul(a, t2);
      t4 = Fp2.mul(b3, t4);
      t1 = Fp2.add(t1, t2);
      t2 = Fp2.sub(t0, t2);
      t2 = Fp2.mul(a, t2);
      t4 = Fp2.add(t4, t2);
      t0 = Fp2.mul(t1, t4);
      Y3 = Fp2.add(Y3, t0);
      t0 = Fp2.mul(t5, t4);
      X3 = Fp2.mul(t3, X3);
      X3 = Fp2.sub(X3, t0);
      t0 = Fp2.mul(t3, t1);
      Z3 = Fp2.mul(t5, Z3);
      Z3 = Fp2.add(Z3, t0);
      return new Point2(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point2.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, pointPrecomputes, n, (comp) => {
        const toInv = Fp2.invertBatch(comp.map((p) => p.pz));
        return comp.map((p, i) => p.toAffine(toInv[i])).map(Point2.fromAffine);
      });
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(n) {
      const I = Point2.ZERO;
      if (n === _0n4)
        return I;
      assertGE(n);
      if (n === _1n4)
        return this;
      const { endo } = CURVE;
      if (!endo)
        return wnaf.unsafeLadder(this, n);
      let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n4 || k2 > _0n4) {
        if (k1 & _1n4)
          k1p = k1p.add(d);
        if (k2 & _1n4)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n4;
        k2 >>= _1n4;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point2(Fp2.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      assertGE(scalar);
      let n = scalar;
      let point, fake;
      const { endo } = CURVE;
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point2(Fp2.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f } = this.wNAF(n);
        point = p;
        fake = f;
      }
      return Point2.normalizeZ([point, fake])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point2.BASE;
      const mul = (P, a2) => a2 === _0n4 || a2 === _1n4 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? void 0 : sum;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(iz) {
      const { px: x, py: y, pz: z } = this;
      const is0 = this.is0();
      if (iz == null)
        iz = is0 ? Fp2.ONE : Fp2.inv(z);
      const ax = Fp2.mul(x, iz);
      const ay = Fp2.mul(y, iz);
      const zz = Fp2.mul(z, iz);
      if (is0)
        return { x: Fp2.ZERO, y: Fp2.ZERO };
      if (!Fp2.eql(zz, Fp2.ONE))
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n4)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point2, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n4)
        return this;
      if (clearCofactor)
        return clearCofactor(Point2, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      this.assertValidity();
      return toBytes2(Point2, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex(this.toRawBytes(isCompressed));
    }
  }
  Point2.BASE = new Point2(CURVE.Gx, CURVE.Gy, Fp2.ONE);
  Point2.ZERO = new Point2(Fp2.ZERO, Fp2.ONE, Fp2.ZERO);
  const _bits = CURVE.nBitLength;
  const wnaf = wNAF(Point2, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
  return {
    CURVE,
    ProjectivePoint: Point2,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  });
  return Object.freeze({ lowS: true, ...opts });
}
function weierstrass(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp: Fp2, n: CURVE_ORDER } = CURVE;
  const compressedLen = Fp2.BYTES + 1;
  const uncompressedLen = 2 * Fp2.BYTES + 1;
  function isValidFieldElement(num) {
    return _0n4 < num && num < Fp2.ORDER;
  }
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function invN(a) {
    return invert(a, CURVE_ORDER);
  }
  const { ProjectivePoint: Point2, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
    ...CURVE,
    toBytes(_c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp2.toBytes(a.x);
      const cat = concatBytes2;
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
      } else {
        return cat(Uint8Array.from([4]), x, Fp2.toBytes(a.y));
      }
    },
    fromBytes(bytes2) {
      const len = bytes2.length;
      const head = bytes2[0];
      const tail = bytes2.subarray(1);
      if (len === compressedLen && (head === 2 || head === 3)) {
        const x = bytesToNumberBE(tail);
        if (!isValidFieldElement(x))
          throw new Error("Point is not on curve");
        const y2 = weierstrassEquation(x);
        let y = Fp2.sqrt(y2);
        const isYOdd = (y & _1n4) === _1n4;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y = Fp2.neg(y);
        return { x, y };
      } else if (len === uncompressedLen && head === 4) {
        const x = Fp2.fromBytes(tail.subarray(0, Fp2.BYTES));
        const y = Fp2.fromBytes(tail.subarray(Fp2.BYTES, 2 * Fp2.BYTES));
        return { x, y };
      } else {
        throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
      }
    }
  });
  const numToNByteStr = (num) => bytesToHex(numberToBytesBE(num, CURVE.nByteLength));
  function isBiggerThanHalfOrder(number2) {
    const HALF = CURVE_ORDER >> _1n4;
    return number2 > HALF;
  }
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? modN(-s) : s;
  }
  const slcNum = (b, from3, to) => bytesToNumberBE(b.slice(from3, to));
  class Signature {
    constructor(r, s, recovery) {
      this.r = r;
      this.s = s;
      this.recovery = recovery;
      this.assertValidity();
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(hex) {
      const l = CURVE.nByteLength;
      hex = ensureBytes("compactSignature", hex, l * 2);
      return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(hex) {
      const { r, s } = DER.toSig(ensureBytes("DER", hex));
      return new Signature(r, s);
    }
    assertValidity() {
      if (!isWithinCurveOrder(this.r))
        throw new Error("r must be 0 < r < CURVE.n");
      if (!isWithinCurveOrder(this.s))
        throw new Error("s must be 0 < s < CURVE.n");
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r, s, recovery: rec } = this;
      const h = bits2int_modN(ensureBytes("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp2.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R = Point2.fromHex(prefix + numToNByteStr(radj));
      const ir = invN(radj);
      const u1 = modN(-h * ir);
      const u2 = modN(s * ir);
      const Q = Point2.BASE.multiplyAndAddUnsafe(R, u1, u2);
      if (!Q)
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return hexToBytes(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig({ r: this.r, s: this.s });
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return hexToBytes(this.toCompactHex());
    }
    toCompactHex() {
      return numToNByteStr(this.r) + numToNByteStr(this.s);
    }
  }
  const utils = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: () => {
      const length3 = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length3), CURVE.n);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(windowSize = 8, point = Point2.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  function getPublicKey(privateKey, isCompressed = true) {
    return Point2.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  function isProbPub(item) {
    const arr = isBytes3(item);
    const str = typeof item === "string";
    const len = (arr || str) && item.length;
    if (arr)
      return len === compressedLen || len === uncompressedLen;
    if (str)
      return len === 2 * compressedLen || len === 2 * uncompressedLen;
    if (item instanceof Point2)
      return true;
    return false;
  }
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA))
      throw new Error("first arg must be private key");
    if (!isProbPub(publicB))
      throw new Error("second arg must be public key");
    const b = Point2.fromHex(publicB);
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  const bits2int = CURVE.bits2int || function(bytes2) {
    const num = bytesToNumberBE(bytes2);
    const delta = bytes2.length * 8 - CURVE.nBitLength;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function(bytes2) {
    return modN(bits2int(bytes2));
  };
  const ORDER_MASK = bitMask(CURVE.nBitLength);
  function int2octets(num) {
    if (typeof num !== "bigint")
      throw new Error("bigint expected");
    if (!(_0n4 <= num && num < ORDER_MASK))
      throw new Error(`bigint expected < 2^${CURVE.nBitLength}`);
    return numberToBytesBE(num, CURVE.nByteLength);
  }
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k) => k in opts))
      throw new Error("sign() legacy options not supported");
    const { hash: hash2, randomBytes: randomBytes3 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash2(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (ent != null) {
      const e = ent === true ? randomBytes3(Fp2.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e));
    }
    const seed = concatBytes2(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!isWithinCurveOrder(k))
        return;
      const ik = invN(k);
      const q = Point2.BASE.multiply(k).toAffine();
      const r = modN(q.x);
      if (r === _0n4)
        return;
      const s = modN(ik * modN(m + r * d));
      if (s === _0n4)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n4);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, recovery);
    }
    return { seed, k2sig };
  }
  const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
  const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
  function sign(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const C = CURVE;
    const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
    return drbg(seed, k2sig);
  }
  Point2.BASE._setWindowSize(8);
  function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
    const sg = signature;
    msgHash = ensureBytes("msgHash", msgHash);
    publicKey = ensureBytes("publicKey", publicKey);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    const { lowS, prehash } = opts;
    let _sig = void 0;
    let P;
    try {
      if (typeof sg === "string" || isBytes3(sg)) {
        try {
          _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
          _sig = Signature.fromCompact(sg);
        }
      } else if (typeof sg === "object" && typeof sg.r === "bigint" && typeof sg.s === "bigint") {
        const { r: r2, s: s2 } = sg;
        _sig = new Signature(r2, s2);
      } else {
        throw new Error("PARSE");
      }
      P = Point2.fromHex(publicKey);
    } catch (error) {
      if (error.message === "PARSE")
        throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
      return false;
    }
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = CURVE.hash(msgHash);
    const { r, s } = _sig;
    const h = bits2int_modN(msgHash);
    const is = invN(s);
    const u1 = modN(h * is);
    const u2 = modN(r * is);
    const R = Point2.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
    if (!R)
      return false;
    const v = modN(R.x);
    return v === r;
  }
  return {
    CURVE,
    getPublicKey,
    getSharedSecret,
    sign,
    verify,
    ProjectivePoint: Point2,
    Signature,
    utils
  };
}

// node_modules/@noble/curves/esm/_shortw_utils.js
function getHash(hash2) {
  return {
    hash: hash2,
    hmac: (key, ...msgs) => hmac(hash2, key, concatBytes(...msgs)),
    randomBytes
  };
}
function createCurve(curveDef, defHash) {
  const create4 = (hash2) => weierstrass({ ...curveDef, ...getHash(hash2) });
  return Object.freeze({ ...create4(defHash), create: create4 });
}

// node_modules/@noble/curves/esm/secp256k1.js
var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
var _1n5 = BigInt(1);
var _2n4 = BigInt(2);
var divNearest = (a, b) => (a + b / _2n4) / b;
function sqrtMod(y) {
  const P = secp256k1P;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n3, P) * b3 % P;
  const b9 = pow2(b6, _3n3, P) * b3 % P;
  const b11 = pow2(b9, _2n4, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n3, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n4, P);
  if (!Fp.eql(Fp.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
var Fp = Field(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
var secp256k1 = createCurve({
  a: BigInt(0),
  // equation params: a, b
  b: BigInt(7),
  // Seem to be rigid: bitcointalk.org/index.php?topic=289795.msg3183975#msg3183975
  Fp,
  // Field's prime: 2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n
  n: secp256k1N,
  // Curve order, total count of valid points in the field
  // Base point (x, y) aka generator point
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  h: BigInt(1),
  // Cofactor
  lowS: true,
  // Allow only low-S signatures by default in sign() and verify()
  /**
   * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
   * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
   * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
   * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
   */
  endo: {
    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
    splitScalar: (k) => {
      const n = secp256k1N;
      const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
      const b1 = -_1n5 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
      const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
      const b2 = a1;
      const POW_2_128 = BigInt("0x100000000000000000000000000000000");
      const c1 = divNearest(b2 * k, n);
      const c2 = divNearest(-b1 * k, n);
      let k1 = mod(k - c1 * a1 - c2 * a2, n);
      let k2 = mod(-c1 * b1 - c2 * b2, n);
      const k1neg = k1 > POW_2_128;
      const k2neg = k2 > POW_2_128;
      if (k1neg)
        k1 = n - k1;
      if (k2neg)
        k2 = n - k2;
      if (k1 > POW_2_128 || k2 > POW_2_128) {
        throw new Error("splitScalar: Endomorphism failed, k=" + k);
      }
      return { k1neg, k1, k2neg, k2 };
    }
  }
}, sha2562);
var _0n5 = BigInt(0);
var Point = secp256k1.ProjectivePoint;

// node_modules/@libp2p/crypto/dist/src/keys/secp256k1.js
function generateKey3() {
  return secp256k1.utils.randomPrivateKey();
}
function hashAndSign3(key, msg) {
  const hash2 = crypto8.createHash("sha256");
  if (msg instanceof Uint8Array) {
    hash2.update(msg);
  } else {
    for (const buf of msg) {
      hash2.update(buf);
    }
  }
  const digest2 = hash2.digest();
  try {
    const signature = secp256k1.sign(digest2, key);
    return signature.toDERRawBytes();
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_INPUT");
  }
}
function hashAndVerify3(key, sig, msg) {
  const hash2 = crypto8.createHash("sha256");
  if (msg instanceof Uint8Array) {
    hash2.update(msg);
  } else {
    for (const buf of msg) {
      hash2.update(buf);
    }
  }
  const digest2 = hash2.digest();
  try {
    return secp256k1.verify(sig, digest2, key);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_INPUT");
  }
}
function compressPublicKey(key) {
  const point = secp256k1.ProjectivePoint.fromHex(key).toRawBytes(true);
  return point;
}
function validatePrivateKey(key) {
  try {
    secp256k1.getPublicKey(key, true);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PRIVATE_KEY");
  }
}
function validatePublicKey(key) {
  try {
    secp256k1.ProjectivePoint.fromHex(key);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PUBLIC_KEY");
  }
}
function computePublicKey(privateKey) {
  try {
    return secp256k1.getPublicKey(privateKey, true);
  } catch (err) {
    throw new CodeError(String(err), "ERR_INVALID_PRIVATE_KEY");
  }
}

// node_modules/@libp2p/crypto/dist/src/keys/secp256k1-class.js
var Secp256k1PublicKey = class {
  _key;
  constructor(key) {
    validatePublicKey(key);
    this._key = key;
  }
  verify(data, sig) {
    return hashAndVerify3(this._key, sig, data);
  }
  marshal() {
    return compressPublicKey(this._key);
  }
  get bytes() {
    return PublicKey.encode({
      Type: KeyType.Secp256k1,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  async hash() {
    const p = sha256.digest(this.bytes);
    let bytes2;
    if (isPromise(p)) {
      ({ bytes: bytes2 } = await p);
    } else {
      bytes2 = p.bytes;
    }
    return bytes2;
  }
};
var Secp256k1PrivateKey = class {
  _key;
  _publicKey;
  constructor(key, publicKey) {
    this._key = key;
    this._publicKey = publicKey ?? computePublicKey(key);
    validatePrivateKey(this._key);
    validatePublicKey(this._publicKey);
  }
  sign(message2) {
    return hashAndSign3(this._key, message2);
  }
  get public() {
    return new Secp256k1PublicKey(this._publicKey);
  }
  marshal() {
    return this._key;
  }
  get bytes() {
    return PrivateKey.encode({
      Type: KeyType.Secp256k1,
      Data: this.marshal()
    }).subarray();
  }
  equals(key) {
    return equals3(this.bytes, key.bytes);
  }
  hash() {
    const p = sha256.digest(this.bytes);
    if (isPromise(p)) {
      return p.then(({ bytes: bytes2 }) => bytes2);
    }
    return p.bytes;
  }
  /**
   * Gets the ID of the key.
   *
   * The key id is the base58 encoding of the SHA-256 multihash of its public key.
   * The public key is a protobuf encoding containing a type and the DER encoding
   * of the PKCS SubjectPublicKeyInfo.
   */
  async id() {
    const hash2 = await this.public.hash();
    return toString2(hash2, "base58btc");
  }
  /**
   * Exports the key into a password protected `format`
   */
  async export(password, format2 = "libp2p-key") {
    if (format2 === "libp2p-key") {
      return exporter(this.bytes, password);
    } else {
      throw new CodeError(`export format '${format2}' is not supported`, "ERR_INVALID_EXPORT_FORMAT");
    }
  }
};
function unmarshalSecp256k1PrivateKey(bytes2) {
  return new Secp256k1PrivateKey(bytes2);
}
function unmarshalSecp256k1PublicKey(bytes2) {
  return new Secp256k1PublicKey(bytes2);
}
async function generateKeyPair3() {
  const privateKeyBytes = generateKey3();
  return new Secp256k1PrivateKey(privateKeyBytes);
}

// node_modules/@libp2p/crypto/dist/src/keys/index.js
var supportedKeys = {
  rsa: rsa_class_exports,
  ed25519: ed25519_class_exports,
  secp256k1: secp256k1_class_exports
};
function unsupportedKey(type) {
  const supported = Object.keys(supportedKeys).join(" / ");
  return new CodeError(`invalid or unsupported key type ${type}. Must be ${supported}`, "ERR_UNSUPPORTED_KEY_TYPE");
}
function typeToKey(type) {
  type = type.toLowerCase();
  if (type === "rsa" || type === "ed25519" || type === "secp256k1") {
    return supportedKeys[type];
  }
  throw unsupportedKey(type);
}
async function generateKeyPair4(type, bits) {
  return typeToKey(type).generateKeyPair(bits ?? 2048);
}
async function generateKeyPairFromSeed2(type, seed, bits) {
  if (type.toLowerCase() !== "ed25519") {
    throw new CodeError("Seed key derivation is unimplemented for RSA or secp256k1", "ERR_UNSUPPORTED_KEY_DERIVATION_TYPE");
  }
  return generateKeyPairFromSeed(seed);
}
function unmarshalPublicKey(buf) {
  const decoded = PublicKey.decode(buf);
  const data = decoded.Data ?? new Uint8Array();
  switch (decoded.Type) {
    case KeyType.RSA:
      return supportedKeys.rsa.unmarshalRsaPublicKey(data);
    case KeyType.Ed25519:
      return supportedKeys.ed25519.unmarshalEd25519PublicKey(data);
    case KeyType.Secp256k1:
      return supportedKeys.secp256k1.unmarshalSecp256k1PublicKey(data);
    default:
      throw unsupportedKey(decoded.Type ?? "unknown");
  }
}
function marshalPublicKey(key, type) {
  type = (type ?? "rsa").toLowerCase();
  typeToKey(type);
  return key.bytes;
}
async function unmarshalPrivateKey2(buf) {
  const decoded = PrivateKey.decode(buf);
  const data = decoded.Data ?? new Uint8Array();
  switch (decoded.Type) {
    case KeyType.RSA:
      return supportedKeys.rsa.unmarshalRsaPrivateKey(data);
    case KeyType.Ed25519:
      return supportedKeys.ed25519.unmarshalEd25519PrivateKey(data);
    case KeyType.Secp256k1:
      return supportedKeys.secp256k1.unmarshalSecp256k1PrivateKey(data);
    default:
      throw unsupportedKey(decoded.Type ?? "RSA");
  }
}
function marshalPrivateKey(key, type) {
  type = (type ?? "rsa").toLowerCase();
  typeToKey(type);
  return key.bytes;
}
async function importKey(encryptedKey, password) {
  try {
    const key = await importer(encryptedKey, password);
    return await unmarshalPrivateKey2(key);
  } catch (_) {
  }
  if (!encryptedKey.includes("BEGIN")) {
    throw new CodeError("Encrypted key was not a libp2p-key or a PEM file", "ERR_INVALID_IMPORT_FORMAT");
  }
  return importFromPem(encryptedKey, password);
}

// node_modules/@libp2p/peer-id/dist/src/index.js
var inspect = Symbol.for("nodejs.util.inspect.custom");
var baseDecoder = Object.values(bases).map((codec) => codec.decoder).reduce((acc, curr) => acc.or(curr), bases.identity.decoder);
var LIBP2P_KEY_CODE = 114;
var MARSHALLED_ED225519_PUBLIC_KEY_LENGTH = 36;
var MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH = 37;
var PeerIdImpl = class {
  type;
  multihash;
  privateKey;
  publicKey;
  string;
  constructor(init) {
    this.type = init.type;
    this.multihash = init.multihash;
    this.privateKey = init.privateKey;
    Object.defineProperty(this, "string", {
      enumerable: false,
      writable: true
    });
  }
  get [Symbol.toStringTag]() {
    return `PeerId(${this.toString()})`;
  }
  [peerIdSymbol] = true;
  toString() {
    if (this.string == null) {
      this.string = base58btc.encode(this.multihash.bytes).slice(1);
    }
    return this.string;
  }
  // return self-describing String representation
  // in default format from RFC 0001: https://github.com/libp2p/specs/pull/209
  toCID() {
    return CID.createV1(LIBP2P_KEY_CODE, this.multihash);
  }
  toBytes() {
    return this.multihash.bytes;
  }
  /**
   * Returns Multiaddr as a JSON string
   */
  toJSON() {
    return this.toString();
  }
  /**
   * Checks the equality of `this` peer against a given PeerId
   */
  equals(id) {
    if (id == null) {
      return false;
    }
    if (id instanceof Uint8Array) {
      return equals3(this.multihash.bytes, id);
    } else if (typeof id === "string") {
      return peerIdFromString(id).equals(this);
    } else if (id?.multihash?.bytes != null) {
      return equals3(this.multihash.bytes, id.multihash.bytes);
    } else {
      throw new Error("not valid Id");
    }
  }
  /**
   * Returns PeerId as a human-readable string
   * https://nodejs.org/api/util.html#utilinspectcustom
   *
   * @example
   * ```js
   * import { peerIdFromString } from '@libp2p/peer-id'
   *
   * console.info(peerIdFromString('QmFoo'))
   * // 'PeerId(QmFoo)'
   * ```
   */
  [inspect]() {
    return `PeerId(${this.toString()})`;
  }
};
var RSAPeerIdImpl = class extends PeerIdImpl {
  type = "RSA";
  publicKey;
  constructor(init) {
    super({ ...init, type: "RSA" });
    this.publicKey = init.publicKey;
  }
};
var Ed25519PeerIdImpl = class extends PeerIdImpl {
  type = "Ed25519";
  publicKey;
  constructor(init) {
    super({ ...init, type: "Ed25519" });
    this.publicKey = init.multihash.digest;
  }
};
var Secp256k1PeerIdImpl = class extends PeerIdImpl {
  type = "secp256k1";
  publicKey;
  constructor(init) {
    super({ ...init, type: "secp256k1" });
    this.publicKey = init.multihash.digest;
  }
};
function peerIdFromString(str, decoder) {
  decoder = decoder ?? baseDecoder;
  if (str.charAt(0) === "1" || str.charAt(0) === "Q") {
    const multihash = decode4(base58btc.decode(`z${str}`));
    if (str.startsWith("12D")) {
      return new Ed25519PeerIdImpl({ multihash });
    } else if (str.startsWith("16U")) {
      return new Secp256k1PeerIdImpl({ multihash });
    } else {
      return new RSAPeerIdImpl({ multihash });
    }
  }
  return peerIdFromBytes(baseDecoder.decode(str));
}
function peerIdFromBytes(buf) {
  try {
    const multihash = decode4(buf);
    if (multihash.code === identity.code) {
      if (multihash.digest.length === MARSHALLED_ED225519_PUBLIC_KEY_LENGTH) {
        return new Ed25519PeerIdImpl({ multihash });
      } else if (multihash.digest.length === MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH) {
        return new Secp256k1PeerIdImpl({ multihash });
      }
    }
    if (multihash.code === sha256.code) {
      return new RSAPeerIdImpl({ multihash });
    }
  } catch {
    return peerIdFromCID(CID.decode(buf));
  }
  throw new Error("Supplied PeerID CID is invalid");
}
function peerIdFromCID(cid) {
  if (cid == null || cid.multihash == null || cid.version == null || cid.version === 1 && cid.code !== LIBP2P_KEY_CODE) {
    throw new Error("Supplied PeerID CID is invalid");
  }
  const multihash = cid.multihash;
  if (multihash.code === sha256.code) {
    return new RSAPeerIdImpl({ multihash: cid.multihash });
  } else if (multihash.code === identity.code) {
    if (multihash.digest.length === MARSHALLED_ED225519_PUBLIC_KEY_LENGTH) {
      return new Ed25519PeerIdImpl({ multihash: cid.multihash });
    } else if (multihash.digest.length === MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH) {
      return new Secp256k1PeerIdImpl({ multihash: cid.multihash });
    }
  }
  throw new Error("Supplied PeerID CID is invalid");
}
async function peerIdFromKeys(publicKey, privateKey) {
  if (publicKey.length === MARSHALLED_ED225519_PUBLIC_KEY_LENGTH) {
    return new Ed25519PeerIdImpl({ multihash: create(identity.code, publicKey), privateKey });
  }
  if (publicKey.length === MARSHALLED_SECP256K1_PUBLIC_KEY_LENGTH) {
    return new Secp256k1PeerIdImpl({ multihash: create(identity.code, publicKey), privateKey });
  }
  return new RSAPeerIdImpl({ multihash: await sha256.digest(publicKey), publicKey, privateKey });
}

// node_modules/@libp2p/peer-id-factory/dist/src/index.js
var createEd25519PeerId = async () => {
  const key = await generateKeyPair4("Ed25519");
  const id = await createFromPrivKey(key);
  if (id.type === "Ed25519") {
    return id;
  }
  throw new Error(`Generated unexpected PeerId type "${id.type}"`);
};
async function createFromPrivKey(privateKey) {
  return peerIdFromKeys(marshalPublicKey(privateKey.public), marshalPrivateKey(privateKey));
}

// src/generatePeerId.ts
async function generatePeerIdFactory() {
  const peerId = await createEd25519PeerId();
  console.log(peerId.toString());
  const decoder = new TextDecoder("utf-8");
  console.log(decoder.decode(peerId.privateKey).toString());
  const publicKeyHex = Buffer.from(peerId.publicKey).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
  console.log(publicKeyHex);
  console.log(Buffer.from(peerId.publicKey).toString());
  console.log(base58btc.baseEncode(peerId.multihash.bytes));
  const id = identity.digest(Buffer.from(peerId.publicKey));
  console.log(Buffer.from(id.digest).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), ""));
  console.log(base64.baseEncode(Buffer.from(peerId.privateKey)));
  const privateKeyHex = Buffer.from(peerId.privateKey).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
  console.log(privateKeyHex);
  return peerId;
}
async function generateKeys() {
  const keys = await keys_exports2.generateKeyPair("RSA", 1024);
  console.log("PeerId: ", await keys.id());
  const peerId = await peerIdFromKeys(keys.public.bytes, keys.bytes);
  console.log("PeerId: ", peerId);
  console.log("PrivateKey: ", keys.marshal().toString());
  console.log("PrivateKey: ", base58btc.baseEncode(keys.marshal()));
  console.log("PublicKey: ", keys.public.marshal().toString());
  const publicKeyHex = Buffer.from(peerId.publicKey).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
  console.log(publicKeyHex);
  const privateKeyHex = Buffer.from(peerId.privateKey).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
  console.log(privateKeyHex);
  const publicKeyBase64 = Buffer.from(publicKeyHex, "hex").toString("base64");
  console.log(publicKeyBase64);
  const privateKeyBase64 = Buffer.from(privateKeyHex, "hex").toString("base64");
  console.log(privateKeyBase64);
}

// src/index.ts
async function main() {
  await generatePeerIdFactory();
  await generateKeys();
}
main().then(() => {
  console.log("Done");
});
export {
  main
};
/*! Bundled license information:

pvtsutils/build/index.js:
  (*!
   * MIT License
   * 
   * Copyright (c) 2017-2022 Peculiar Ventures, LLC
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   * 
   *)

pvutils/build/utils.js:
  (*!
   Copyright (c) Peculiar Ventures, LLC
  *)

asn1js/build/index.js:
  (*!
   * Copyright (c) 2014, GMO GlobalSign
   * Copyright (c) 2015-2022, Peculiar Ventures
   * All rights reserved.
   * 
   * Author 2014-2019, Yury Strozhevsky
   * 
   * Redistribution and use in source and binary forms, with or without modification,
   * are permitted provided that the following conditions are met:
   * 
   * * Redistributions of source code must retain the above copyright notice, this
   *   list of conditions and the following disclaimer.
   * 
   * * Redistributions in binary form must reproduce the above copyright notice, this
   *   list of conditions and the following disclaimer in the documentation and/or
   *   other materials provided with the distribution.
   * 
   * * Neither the name of the copyright holder nor the names of its
   *   contributors may be used to endorse or promote products derived from
   *   this software without specific prior written permission.
   * 
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
   * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   * 
   *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/weierstrass.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/_shortw_utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
