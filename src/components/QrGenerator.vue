<template>
  <div class="card p-4">
    <div class="card-body">
      <h5 class="card-title text-center mb-4">Generador de Códigos QR</h5>
      <div class="mb-3">
        <label for="urlInput" class="form-label">Introduce la URL</label>
        <input type="url" class="form-control rounded-pill" id="urlInput" placeholder="https://ejemplo.com" v-model="url" @keyup.enter="generateQr">
      </div>
      <div class="d-grid gap-2">
        <button class="btn btn-primary rounded-pill" @click="generateQr">Generar y Guardar QR</button>
      </div>
      <div v-if="qrUrl" class="text-center mt-4">
        <h6 class="mb-3">Código QR generado:</h6>
        <div id="qrcode" class="d-inline-block p-2 border rounded-3 bg-light"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, nextTick } from 'vue';
import { supabase } from '@/supabase/supabase.js';
// Nota: La librería qrcodejs debe estar incluida en tu archivo index.html

export default defineComponent({
  emits: ['onGenerate'],
  setup(props, { emit }) {
    const url = ref('');
    const qrUrl = ref('');

    const generateQr = async () => {
      if (url.value.trim() === '') {
        alert('Por favor, introduce una URL válida.');
        return;
      }

      // Guardar la URL en la base de datos de Supabase
      const { data, error } = await supabase
        .from('qr_code')
        .insert({ text_code: url.value });

      if (error) {
        console.error('Error al guardar la URL:', error);
        alert('Hubo un error al guardar la URL.');
        return;
      }

      // Generar y mostrar el código QR
      qrUrl.value = url.value;
      await nextTick(); // Espera a que el DOM se actualice
      document.getElementById('qrcode').innerHTML = '';
      new QRCode(document.getElementById('qrcode'), {
        text: url.value,
        width: 200,
        height: 200,
      });

      // Emitir evento al componente padre (App.vue)
      emit('onGenerate');
    };

    return {
      url,
      qrUrl,
      generateQr
    };
  }
});
</script>
