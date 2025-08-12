import {
    generateEd25519PeerId,
    generateSecp256k1PeerId
} from './generatePeerId.js'


const peerIdDemo = async () => {
    console.log('  Generating Ed25519 Peer ID...')
    const ed25519PeerId = await generateEd25519PeerId()
    console.log('  Ed25519 Peer ID generated:', ed25519PeerId)


    console.log('  Generating Secp256k1 Peer ID...')
    const secp256k1PeerId = await generateSecp256k1PeerId()
    console.log('  Secp256k1 Peer ID generated:', secp256k1PeerId)
}



const demo = async () => {
    console.log('Running IPFS Liftoff Snippet Demo...')

    await peerIdDemo()

    console.log('Done')
}


await demo().catch((error) => {
    console.error('Error occurred during demo execution:', error)
})