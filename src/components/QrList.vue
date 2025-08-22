<template>
  <div class="card p-4 mt-4">
    <div class="card-body">
      <h5 class="card-title text-center mb-4">Códigos QR Guardados</h5>
      <div v-if="loading" class="text-center">Cargando...</div>
      <div v-else-if="qrCodes.length === 0" class="text-center text-muted">Aún no hay códigos QR guardados.</div>
      <div v-else class="list-group">
        <a v-for="item in qrCodes" :key="item.id" :href="item.text_code" target="_blank" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-pill mb-2">
          <span class="text-truncate">{{ item.text_code }}</span>
          <div class="qr-preview-container d-none d-sm-block">
            <div :id="'qr-' + item.id" class="qr-preview"></div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, nextTick } from 'vue';
import { supabase } from '@/supabase/supabase.js';
// Nota: La librería qrcodejs debe estar incluida en tu archivo index.html

export default defineComponent({
  props: {
    refreshKey: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const qrCodes = ref([]);
    const loading = ref(true);

    const fetchQrCodes = async () => {
      loading.value = true;
      const { data, error } = await supabase
        .from('qr_code')
        .select('id, text_code')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error al obtener los códigos QR:', error);
        return;
      }
      qrCodes.value = data;
      loading.value = false;

      // Generar códigos QR después de que se actualice la lista
      await nextTick();
      data.forEach(item => {
        const qrElement = document.getElementById('qr-' + item.id);
        if (qrElement) {
          new QRCode(qrElement, {
            text: item.text_code,
            width: 50,
            height: 50,
            colorDark: "#0d6efd",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        }
      });
    };

    // Observa los cambios en `refreshKey` para recargar la lista
    watch(() => props.refreshKey, () => {
      fetchQrCodes();
    });

    onMounted(() => {
      fetchQrCodes();
    });

    return {
      qrCodes,
      loading,
    };
  }
});
</script>
