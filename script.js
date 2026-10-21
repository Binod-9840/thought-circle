(() => {
  const message = document.getElementById('message');
  const postsEl = document.getElementById('posts');
  const url = window.THOUGHT_CIRCLE_SUPABASE_URL;
  const key = window.THOUGHT_CIRCLE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes('PASTE_') || key.includes('PASTE_')) {
    message.textContent = 'पहिले config.js मा आफ्नो Supabase Project URL र Publishable key राख्नुहोस्।';
    return;
  }
  if (!window.supabase) { message.textContent = 'Supabase library लोड भएन। इन्टरनेट जाँच गर्नुहोस्।'; return; }
  const client = window.supabase.createClient(url, key);
  client.from('posts').select('id,title,slug,category,excerpt,content,cover_image_url,author_name,language,published_at').eq('status','published').order('published_at',{ascending:false})
    .then(({data,error}) => {
      if (error) { message.textContent = 'लेख लोड गर्दा समस्या भयो: ' + error.message; return; }
      message.textContent = data.length ? '' : 'अहिलेसम्म प्रकाशित लेख छैन।';
      postsEl.innerHTML = '';
      data.forEach(p => {
        const article = document.createElement('article'); article.className='post';
        if (p.cover_image_url) { const img=document.createElement('img'); img.src=p.cover_image_url; img.alt=p.title || ''; article.appendChild(img); }
        const h=document.createElement('h3'); h.textContent=p.title || 'शीर्षक छैन'; article.appendChild(h);
        const meta=document.createElement('small'); meta.textContent=(p.category || '') + (p.author_name ? ' • ' + p.author_name : ''); article.appendChild(meta);
        const ex=document.createElement('p'); ex.textContent=p.excerpt || (p.content || '').slice(0,220); article.appendChild(ex);
        postsEl.appendChild(article);
      });
    });
})();
