// 1. useEffect Atualizado para Forçar o Vídeo
useEffect(() => {
  let interval: NodeJS.Timeout;
  
  if (cameraActive && webcamRef.current) {
    // Tentativa repetida de Play (contorna bloqueios de renderização do Dyad)
    interval = setInterval(() => {
      if (webcamRef.current && webcamRef.current.paused) {
        webcamRef.current.play().catch(() => {});
      } else {
        clearInterval(interval);
      }
    }, 500);
  }
  
  return () => {
    if (interval) clearInterval(interval);
  };
}, [cameraActive]);

// 2. Função startCamera com Limpeza de Stream
const startCamera = async () => {
  try {
    // Forçamos a parada de qualquer uso anterior para evitar conflitos
    if (webcamRef.current?.srcObject) {
      const tracks = (webcamRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }

    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 }, 
        height: { ideal: 720 },
        facingMode: "user" 
      }, 
      audio: true 
    });
    
    if (webcamRef.current) {
      webcamRef.current.srcObject = stream;
      // Atributos vitais para navegadores modernos
      webcamRef.current.setAttribute("playsinline", "true");
      webcamRef.current.setAttribute("autoplay", "true");
      webcamRef.current.muted = true;
      
      setCameraActive(true);
    }
  } catch (err) {
    console.error("Erro fatal na câmera:", err);
    alert("O Dyad não permitiu a exibição. Verifique se não há outro app (Zoom, Meet) usando a câmera agora.");
  }
};