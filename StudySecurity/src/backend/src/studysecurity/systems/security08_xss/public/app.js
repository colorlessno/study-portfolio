document.getElementById("render").addEventListener("click", () => {
  const value = document.getElementById("text").value;
  document.getElementById("safe").textContent = value;
  document.getElementById("danger").textContent = `innerHTML would parse markup here: ${value}`;
});
