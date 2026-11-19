/* Direct positional contact solver: no velocity, restitution, or spring forces. */
(function(root){
  const gap=12;
  function overlaps(a,b){return a.x < b.x+b.w+gap-.001 && a.x+a.w+gap > b.x+.001 && a.y < b.y+b.h+gap-.001 && a.y+a.h+gap > b.y+.001;}
  function step(items,index,axis,delta,bounds){
    if(!delta)return true;
    const before=items.map(a=>({x:a.x,y:a.y}));
    const size=axis==='x'?'w':'h', limit=axis==='x'?bounds.w:bounds.h;
    function push(i,d,depth){
      if(depth>items.length)return false;
      const a=items[i];a[axis]+=d;
      if(a[axis]<0 || a[axis]+a[size]>limit)return false;
      for(let j=0;j<items.length;j++){
        if(j===i || !overlaps(a,items[j]))continue;
        const b=items[j];
        const amount=d>0 ? a[axis]+a[size]+gap-b[axis] : a[axis]-gap-b[size]-b[axis];
        if(!push(j,amount,depth+1))return false;
      }
      return true;
    }
    if(push(index,delta,0))return true;
    items.forEach((a,i)=>Object.assign(a,before[i]));return false;
  }
  function move(items,index,dx,dy,bounds){
    const count=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/4));
    for(let s=0;s<count;s++){step(items,index,'x',dx/count,bounds);step(items,index,'y',dy/count,bounds);}
  }
  const api={move,overlaps}; if(typeof module!=='undefined')module.exports=api;else root.ArchitectureCollision=api;
})(typeof window!=='undefined'?window:globalThis);
