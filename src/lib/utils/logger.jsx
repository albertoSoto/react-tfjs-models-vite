const enabled = false;

export default function log(msg) {
    if (enabled) {
        console.log(msg)
    }
}
