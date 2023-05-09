/* eslint-disable no-lone-blocks */
/* Analyzed bindings: {
  "ref": "setup-const",
  "style": "setup-maybe-ref",
  "addModal": "setup-const",
  "msg": "setup-ref"
} */
import { Fragment as _Fragment, createElementBlock as _createElementBlock, createElementVNode as _createElementVNode, openBlock as _openBlock, toDisplayString as _toDisplayString, vModelText as _vModelText, withDirectives as _withDirectives, onUnmounted } from 'vue'

import { ref } from 'vue'

/** compile ret */
const { document } = vue_lib

const _hoisted_1 = { class: 'red' }

const __sfc__ = {
  __name: 'App',
  setup(__props) {
    const style = document.createElement('style')
    style.innerHTML = `.red{
  background-color:red
  }
  .modal{
  width:300px;
  height:300px;
  position:fixed;
  top:0;
  left:0
  }
  `
    document.head.appendChild(style)
    onUnmounted(() => {
      console.log('unmount')
    })
    function addModal() {
      const el = document.createElement('div')
      el.textContent = 'modal'
      el.className = 'red modal'
      document.body.append(el)
    }
    const msg = ref('Hello World!')

    return (_ctx, _cache) => {
      return (_openBlock(), _createElementBlock(_Fragment, null, [
        _createElementVNode('h1', _hoisted_1, _toDisplayString(msg.value), 1 /* TEXT */),
        _withDirectives(_createElementVNode('input', {
          'onUpdate:modelValue': _cache[0] || (_cache[0] = $event => ((msg).value = $event)),
        }, null, 512 /* NEED_PATCH */), [
          [_vModelText, msg.value],
        ]),
        _createElementVNode('button', { onClick: addModal }, ' click to add a modal '),
      ], 64 /* STABLE_FRAGMENT */))
    }
  },

}
__sfc__.__file = 'App.vue'
export default __sfc__

{ /* <script setup>
import { ref } from 'vue'
   const style=document.createElement('style')
style.innerHTML=`.red{
  background-color:red
  }
  .modal{
  width:300px;
  height:300px;
  position:fixed;
  top:0;
  left:0
  }
  `
document.head.appendChild(style)

function addModal(){
  const el=document.createElement('div')
  el.textContent='modal'
  el.classList.add('modal')
  document.body.append(el)
}
const msg = ref('Hello World!')
</script>

<template>
  <h1 class="red">{{ msg }}</h1>
  <input v-model="msg">
  <button @click="addModal">
    click to add a modal
  </button>
</template> */ }
