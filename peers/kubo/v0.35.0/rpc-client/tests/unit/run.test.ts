// import { bootstrapTest } from "./bootstrap.test";
// import { connectTest } from "./connect.test";



try {
    // Import the tests dynamically
    const { connectTest } = await import("./connect.test");
    const { bootstrapTest } = await import("./bootstrap.test");

    const tests = [
        connectTest,
        bootstrapTest
    ]

    // Execute the tests
    tests.forEach(async (test) => {
        console.log(`Running test: ${test.name}`);
        try {
            await test();
            console.log(`Test ${test.name} passed`);
        } catch (error) {
            console.error(`Test ${test.name} failed: ${error}`);
        }
    });
}
catch (error) {
    console.error("Error running tests:", error);
}

export {}
