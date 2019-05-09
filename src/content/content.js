/* global document */
import fs from 'fs';
import path from 'path';
import Message from './message'
import ext from 'utils/ext';

class contentScript {
  constructor(){
    this.message = new Message('contentScript')
    this._listen()
    this._inject()
  }

  _listen(){
    window.addEventListener('message', ({ source, data }) => {
      if (source !== window || !data || !data.action) return

      switch (data.action) {
        case 'GET_NODES':
        case 'GET_ACCOUNT':
          this.message.send(data)
          break;
        default:
          break;
      }
    })
  }

  _inject(){
    try {
      const container = document.head || document.documentElement
      const scriptTag = document.createElement('script')
      scriptTag.setAttribute('async', false)

      // const inpageContent = fs.readFileSync(path.join(__dirname, '..', '..', 'temp' , 'chrome', 'inject', 'inject.js')).toString();
      // const inpageSuffix = `//# sourceURL=${ext.runtime.getURL('inject/inject.js')}\n`;
      // const inpageBundle = `${inpageContent}${inpageSuffix}`;
      // scriptTag.textContent = inpageBundle;
      scriptTag.setAttribute('src', chrome.runtime.getURL('inject/inject.js'))
      container.insertBefore(scriptTag, container.children[0])
      // After injecting the script, *run*, remove the script tag.
      container.removeChild(scriptTag)

    } catch (e) {
      // console.error('injection failed', e)
    }
  }
}


new contentScript()