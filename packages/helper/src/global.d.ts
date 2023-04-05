
import type { Merak } from "merak-core"
declare global {
    interface Window {
        $Merak: Merak
        $MerakMap: Map<string,Merak>
        isMerak: boolean
        rawWindow: Window
    }
}


export { }