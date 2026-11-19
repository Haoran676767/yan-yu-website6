const customKey='architecture-custom-buildings';
function readBuildings(){try{return JSON.parse(localStorage.getItem(customKey)||'[]')}catch{return []}}
const customGallery=document.querySelector('.gallery');
readBuildings().forEach(b=>{
 const tile=document.createElement('button');tile.type='button';tile.className='tile';tile.dataset.custom=b.id;tile.dataset.ratio=b.ratio;
 const cut=document.createElement('span');cut.className='cutout';cut.style.aspectRatio=b.ratio;
 const img=document.createElement('img');img.src=b.image;img.alt=b.name;img.draggable=false;img.style.cssText='width:100%;left:0;top:0';cut.append(img);
 const caption=document.createElement('span');caption.className='caption';caption.textContent=b.name;tile.append(cut,caption);customGallery.append(tile);
});
const addTile=document.createElement('button');addTile.type='button';addTile.className='tile add-tile';addTile.dataset.ratio='1';addTile.setAttribute('aria-label','添加建筑');addTile.innerHTML='<span class="cutout add-circle" aria-hidden="true"><span>＋</span></span>';customGallery.append(addTile);
const formDialog=document.createElement('dialog');formDialog.className='add-dialog';
formDialog.innerHTML='<form><button class="close-dialog" type="button" aria-label="关闭">×</button><h2></h2><label><span data-label="image"></span><input name="image" type="file" accept="image/png,image/jpeg,image/webp" required></label><label><span data-label="name"></span><input name="name" maxlength="100" required></label><label><span data-label="description"></span><textarea name="description" rows="6" maxlength="3000" required></textarea></label><p class="form-error" role="alert"></p><button class="save-building" type="submit"></button></form>';
document.body.append(formDialog);
function openBuildingForm(){const en=document.documentElement.lang==='en';formDialog.querySelector('h2').textContent=en?'Add building':'添加建筑';const labels=en?['Building image','Building name','Introduction']:['建筑图片','建筑名称','建筑介绍'];formDialog.querySelectorAll('[data-label]').forEach((el,i)=>el.textContent=labels[i]);formDialog.querySelector('.close-dialog').setAttribute('aria-label',en?'Close':'关闭');formDialog.querySelector('.save-building').textContent=en?'Add':'添加';formDialog.querySelector('.form-error').textContent='';formDialog.showModal();}
formDialog.querySelector('.close-dialog').onclick=()=>formDialog.close();
formDialog.addEventListener('click',e=>{if(e.target===formDialog){const b=formDialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)formDialog.close()}});
formDialog.addEventListener('close',()=>addTile.focus({preventScroll:true}));
formDialog.querySelector('form').addEventListener('submit',async e=>{
 e.preventDefault();const form=e.target,save=form.querySelector('.save-building'),error=form.querySelector('.form-error'),en=document.documentElement.lang==='en';error.textContent='';save.disabled=true;
 try{
 const file=form.elements.image.files[0],name=form.elements.name.value.trim(),description=form.elements.description.value.trim();
 if(!name||!description||!file||!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('input');
 if(file.size>20*1024*1024)throw Error('large');
 const url=URL.createObjectURL(file),img=new Image();try{img.src=url;await img.decode();}finally{URL.revokeObjectURL(url)}
 const scale=Math.min(1,1000/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
 const b={id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),name,description,image:canvas.toDataURL('image/webp',.85),ratio:canvas.width/canvas.height};
 localStorage.setItem(customKey,JSON.stringify([...readBuildings(),b]));location.href='index.html?lang='+(en?'en':'zh')+'#gallery';location.reload();
 }catch(err){error.textContent=err.message==='large'?(en?'Choose an image under 20 MB.':'请选择小于20MB的图片。'):err.name==='QuotaExceededError'?(en?'Browser storage is full. Try a smaller image.':'浏览器空间不足，请使用更小的图片。'):(en?'Unable to save. Check the image and fields, and allow browser storage.':'保存失败，请检查图片和填写内容，并允许浏览器存储。');}finally{save.disabled=false}
});
