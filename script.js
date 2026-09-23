
document.addEventListener("DOMContentLoaded",()=>{
 const toggle=document.querySelector(".nav-toggle"),nav=document.querySelector(".main-nav");
 if(toggle&&nav) toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",open)});
 const y=document.querySelectorAll("[data-year]");y.forEach(e=>e.textContent=new Date().getFullYear());
 const form=document.querySelector("#contact-form");
 if(form) form.addEventListener("submit",e=>{
   e.preventDefault();
   const name=form.querySelector("[name=name]").value.trim();
   const topic=form.querySelector("[name=topic]").value;
   const message=form.querySelector("[name=message]").value.trim();
   const subject=encodeURIComponent("Website enquiry - "+topic);
   const body=encodeURIComponent(`Name: ${name}\nTopic: ${topic}\n\n${message}`);
   window.location.href=`mailto:lungelomokoena8@yahoo.com?subject=${subject}&body=${body}`;
 });
});
