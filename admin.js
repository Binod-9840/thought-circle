(() => {
  const status = document.getElementById('status'), login = document.getElementById('login'), editor = document.getElementById('editor');
  const url = window.THOUGHT_CIRCLE_SUPABASE_URL, key = window.THOUGHT_CIRCLE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes('PASTE_') || key.includes('PASTE_')) { status.textContent='पहिले config.js मा Supabase URL र Publishable key राख्नुहोस्।'; return; }
  if (!window.supabase) { status.textContent='Supabase library लोड भएन। इन्टरनेट जाँच गर्नुहोस्।'; return; }
  const db=window.supabase.createClient(url,key); let currentUser=null;
  const el=id=>document.getElementById(id);
  async function refresh(){
    const {data,error}=await db.from('posts').select('id,title,status,created_at').order('created_at',{ascending:false});
    if(error){el('adminPosts').textContent=error.message;return;}
    const box=el('adminPosts'); box.innerHTML='';
    (data||[]).forEach(p=>{const row=document.createElement('p'); row.textContent=`${p.title} — ${p.status} `; const del=document.createElement('button'); del.textContent='मेटाउनुहोस्'; del.onclick=async()=>{if(confirm('यो लेख मेटाउने?')){const r=await db.from('posts').delete().eq('id',p.id); if(r.error)alert(r.error.message); else refresh();}}; row.appendChild(del);box.appendChild(row);});
  }
  async function updateSession(){
    const {data}=await db.auth.getSession(); currentUser=data.session?.user||null;
    login.hidden=!!currentUser; editor.hidden=!currentUser;
    status.textContent=currentUser?'लगइन भयो। लेख प्रकाशित गर्न सक्नुहुन्छ।':'आफ्नो Admin email र password प्रयोग गरेर लगइन गर्नुहोस्।';
    if(currentUser) await refresh();
  }
  el('loginBtn').onclick=async()=>{const {error}=await db.auth.signInWithPassword({email:el('email').value,password:el('password').value});if(error){status.textContent=error.message;return;}updateSession();};
  el('logoutBtn').onclick=async()=>{await db.auth.signOut();updateSession();};
  el('saveBtn').onclick=async()=>{
    const title=el('title').value.trim(),slug=el('slug').value.trim(),content=el('content').value.trim();
    if(!title||!slug||!content){status.textContent='शीर्षक, Slug र लेख भर्नुहोस्।';return;}
    const payload={title,slug,category:el('category').value,excerpt:el('excerpt').value,content,cover_image_url:el('image').value||null,author_name:el('author').value,language:el('language').value,status:el('published').checked?'published':'draft',published_at:el('published').checked?new Date().toISOString():null};
    const {error}=await db.from('posts').insert(payload); if(error){status.textContent='सुरक्षित भएन: '+error.message;return;}
    status.textContent='लेख सुरक्षित भयो।'; ['title','slug','excerpt','content','image'].forEach(id=>el(id).value=''); await refresh();
  };
  updateSession();
})();
