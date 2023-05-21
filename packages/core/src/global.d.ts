
import { Merak } from './merak';
declare global {
    interface Window {
        $Merak:any
        $MerakMap:any
        __merak_url__?:string
        __merak_app__?:Merak
        rawWindow:Window
        MERAK_DEBUG:string
    }
}


export { }