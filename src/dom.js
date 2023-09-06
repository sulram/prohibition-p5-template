let search = new URLSearchParams(window.location.search);
let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
let b58dec = (str) => [...str].reduce((p, c) => (p * alphabet.length + alphabet.indexOf(c)) | 0, 0);
const genHash = () =>
  "0x" +
  Array(66)
    .fill(0)
    .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
    .join("");

// save hash
window.tokenData = {
  hash: search.get("hash") || genHash()
};


(function () {
  const inputHash = document.getElementById("input-hash");
  const btnNew = document.getElementById("btn-new");
  const btnReload = document.getElementById("btn-reload");
  const btnSave = document.getElementById("btn-save");
  const btnSaveLow = document.getElementById("btn-save-low");

  function saveCanvas(btn, canvas){
    const label = btn.innerText;
    btn.disabled = true;
    btn.innerText = 'wait'
    
    canvas.toBlob((blob)=>{
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${window.tokenData.hash}.png`
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      btn.disabled = false;
      btn.innerText = label;
    }, 'image/png');
  }

  function getResizedCanvas(canvas,newWidth,newHeight) {
    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = newWidth;
    tmpCanvas.height = newHeight;
    var ctx = tmpCanvas.getContext('2d');
    ctx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,newWidth,newHeight);
    return tmpCanvas;
  }

  inputHash.value = window.tokenData.hash;
  btnNew.onclick = () => (window.location = `/?hash=${genHash()}`);
  btnReload.onclick = () => (window.location = `/?hash=${window.tokenData.hash}`);
  btnSave.onclick = () => {
    const canvas = document.getElementById("defaultCanvas0");
    saveCanvas(btnSave, canvas)
  }
  btnSaveLow.onclick = () => {
    const canvas = document.getElementById("defaultCanvas0");
    const canvas2 = getResizedCanvas(canvas, canvas.width/4, canvas.height/4)
    saveCanvas(btnSaveLow, canvas2)
    canvas2.remove();
  }
  window.getResizedCanvas = getResizedCanvas
  console.log(window.tokenData);
})();
