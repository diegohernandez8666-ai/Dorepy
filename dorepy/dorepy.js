const si = require('systeminformation');
const axios = require('axios');

const API_URL = 'https://dorepy-ba1bf90a041c.herokuapp.com/api/metrics';

async function enviarDatos() {
    try {
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const gpuData = await si.graphics();
        const proc = await si.processes();

        let gpuUso = 0;
        if (gpuData.controllers && gpuData.controllers.length > 0) {
            gpuUso = gpuData.controllers[0].utilizationGpu || 0;
        }

        const top3 = proc.list
            .filter(p => p.name !== 'System Idle Process')
            .sort((a, b) => b.cpu - a.cpu)
            .slice(0, 3)
            .map(p => ({ nombre: p.name, cpu: p.cpu.toFixed(1) }));

        const payload = {
            cpu: parseFloat(cpu.currentLoad.toFixed(2)),
            ram: parseFloat(((mem.used / mem.total) * 100).toFixed(2)),
            gpu: parseFloat(gpuUso),
            top_procesos: top3
        };

        await axios.post(API_URL, payload);
        console.log(`[${new Date().toLocaleTimeString()}] Enviado -> CPU: ${payload.cpu}% | RAM: ${payload.ram}% | GPU: ${payload.gpu}%`);

    } catch (e) {
        console.log("Servidor no disponible. Reintentando...");
    }
}

console.log("Dorepy activo. Enviando datos...");
setInterval(enviarDatos, 30000);