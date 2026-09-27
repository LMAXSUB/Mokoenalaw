
(function(){
  const WORKER_URL = "https://mokoena-law-ai.crocolungs.workers.dev/chat";
  const launcher = document.getElementById("mokoena-ai-launcher");
  const panel = document.getElementById("mokoena-ai-panel");
  const close = document.getElementById("mokoena-ai-close");
  const form = document.getElementById("mokoena-ai-form");
  const input = document.getElementById("mokoena-ai-input");
  const send = document.getElementById("mokoena-ai-send");
  const messages = document.getElementById("mokoena-ai-messages");
  if(!launcher || !panel || !form) return;

  const history = [];
  function addMessage(role, text){
    const div = document.createElement("div");
    div.className = "mokoena-ai-message " + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  function openPanel(){
    panel.hidden = false;
    launcher.setAttribute("aria-expanded","true");
    input.focus();
  }
  function closePanel(){
    panel.hidden = true;
    launcher.setAttribute("aria-expanded","false");
  }
  launcher.addEventListener("click",()=> panel.hidden ? openPanel() : closePanel());
  close.addEventListener("click",closePanel);
  document.addEventListener("keydown",e=>{if(e.key==="Escape" && !panel.hidden) closePanel();});

  form.addEventListener("submit", async function(e){
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    addMessage("user",text);
    history.push({role:"user",content:text});
    input.value = "";
    send.disabled = true;
    send.textContent = "…";
    try{
      const response = await fetch(WORKER_URL,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:history.slice(-12)})
      });
      const data = await response.json();
      if(!response.ok || !data.ok) throw new Error(data.error || "The assistant is temporarily unavailable.");
      const answer = (data.answer || "").trim() || "Please contact the firm directly for assistance.";
      addMessage("assistant",answer);
      history.push({role:"assistant",content:answer});
    }catch(err){
      addMessage("assistant","I’m temporarily unable to respond. Please call Lungelo Mokoena Attorneys on 079 620 9349 or use the Contact/Consultation page.");
    }finally{
      send.disabled = false;
      send.textContent = "Send";
      input.focus();
    }
  });
})();
