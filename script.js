const artists = [
 {id:1,name:"Ananya Bridal Studio",category:"Makeup",location:"Chennai",rating:4.9,reviews:128,price:8500,priceLabel:"₹8,500",experience:"8 years",tag:"Bride favourite",image:"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=85",description:"Soft-glam, HD and traditional bridal makeup tailored to your features.",services:["HD Bridal Makeup","Airbrush Makeup","Party Makeup"],reviewsText:["Made me feel like the best version of myself.","Beautiful work and so calm on the wedding morning."]},
 {id:2,name:"Mehndi Magic by Anjali",category:"Mehndi",location:"Bengaluru",rating:4.8,reviews:94,price:4500,priceLabel:"₹4,500",experience:"6 years",tag:"Intricate artistry",image:"https://images.unsplash.com/photo-1610173826608-bd1b7f3f4b8a?auto=format&fit=crop&w=800&q=85",description:"Detailed bridal mehndi with traditional motifs and modern custom designs.",services:["Bridal Mehndi","Arabic Mehndi","Family Mehndi"],reviewsText:["The detailing was gorgeous.","Lovely artist, patient and creative."]},
 {id:3,name:"Golden Hour Weddings",category:"Photography",location:"Chennai",rating:5.0,reviews:76,price:18000,priceLabel:"₹18,000",experience:"9 years",tag:"Top rated",image:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=85",description:"Candid wedding photography focused on emotion, light and real moments.",services:["Wedding Photography","Pre-wedding Shoot","Video Coverage"],reviewsText:["They captured moments we missed ourselves.","Every photo feels cinematic."]},
 {id:4,name:"The Silk Story",category:"Bridal Wear",location:"Coimbatore",rating:4.7,reviews:61,price:12000,priceLabel:"₹12,000",experience:"7 years",tag:"Handpicked",image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85",description:"Bridal styling, saree draping and accessory curation for your special look.",services:["Bridal Styling","Saree Draping","Accessories"],reviewsText:["The styling was elegant and personal.","Great attention to every detail."]},
 {id:5,name:"Curl & Crown Studio",category:"Hair Styling",location:"Mumbai",rating:4.8,reviews:83,price:6000,priceLabel:"₹6,000",experience:"5 years",tag:"Modern looks",image:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85",description:"Romantic buns, soft curls and modern bridal hairstyles that last.",services:["Bridal Hair","Floral Hair Styling","Reception Looks"],reviewsText:["My hairstyle stayed perfect all day.","Creative and professional."]},
 {id:6,name:"Petal Skin Rituals",category:"Skincare",location:"Hyderabad",rating:4.6,reviews:52,price:3500,priceLabel:"₹3,500",experience:"6 years",tag:"Glow essentials",image:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=85",description:"A gentle pre-event skincare and glow-prep service for special occasions.",services:["Glow Facial","Pre-event Skin Prep","Hydration Ritual"],reviewsText:["A relaxing experience before the wedding.","My skin felt fresh and hydrated."]}
];

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const safeRead = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
let favorites = safeRead("bridalGlowFavorites", []);
let bookings = safeRead("bridalGlowBookings", []);
let currentUser = safeRead("bridalGlowUser", null);
let favoritesOnly = false;
let activeArtist = null;
let toastTimer;

function money(n){ return "₹" + Number(n).toLocaleString("en-IN"); }
function saveState(){ localStorage.setItem("bridalGlowFavorites", JSON.stringify(favorites)); localStorage.setItem("bridalGlowBookings", JSON.stringify(bookings)); localStorage.setItem("bridalGlowUser", JSON.stringify(currentUser)); }
function showToast(message){ const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2600); }
function getFilters(){ return {q:$("#searchInput").value.trim().toLowerCase(),cat:$("#categoryFilter").value,loc:$("#locationFilter").value,sort:$("#sortFilter").value}; }

function renderArtists(){
 const f=getFilters(); let list=artists.filter(a=>{
  const matchesText=[a.name,a.category,a.location,a.description,...a.services].join(" ").toLowerCase().includes(f.q);
  return matchesText&&(f.cat==="All"||a.category===f.cat)&&(f.loc==="All"||a.location===f.loc)&&(!favoritesOnly||favorites.includes(a.id));
 });
 if(f.sort==="price-low") list.sort((a,b)=>a.price-b.price);
 if(f.sort==="price-high") list.sort((a,b)=>b.price-a.price);
 if(f.sort==="rating") list.sort((a,b)=>b.rating-a.rating);
 $("#resultCount").textContent=list.length;
 $("#emptyState").classList.toggle("hidden",list.length>0);
 $("#artistGrid").classList.toggle("hidden",list.length===0);
 $("#artistGrid").innerHTML=list.map(a=>`
 <article class="artist-card">
  <div class="artist-photo"><img src="${a.image}" alt="${a.name}" loading="lazy"><span class="artist-badge">${a.tag}</span><button class="favorite-btn ${favorites.includes(a.id)?"is-favorite":""}" data-favorite="${a.id}" aria-label="${favorites.includes(a.id)?"Remove":"Add"} ${a.name} ${favorites.includes(a.id)?"from":"to"} favourites">${favorites.includes(a.id)?"♥":"♡"}</button></div>
  <div class="artist-body"><div class="artist-meta"><span class="artist-category">${a.category}</span><span class="rating"><span>★</span> ${a.rating.toFixed(1)} <span style="color:#a89ba1;font-weight:400">(${a.reviews})</span></span></div>
  <h3>${a.name}</h3><div class="artist-location">⌖ ${a.location} · ${a.experience} experience</div><p class="artist-desc">${a.description}</p>
  <div class="artist-bottom"><div><span class="price-label">Packages from</span><span class="price-value">${a.priceLabel}</span></div><div class="artist-buttons"><button class="btn-mini-outline" data-details="${a.id}">View profile</button><button class="btn btn-primary btn-small" data-book="${a.id}">Book ↗</button></div></div></div>
 </article>`).join("");
 $("#favoriteCount").textContent=favorites.length;
 $("#dashFavorites").textContent=favorites.length;
 $("#dashBookings").textContent=bookings.length;
 $("#bookingCount").textContent=bookings.length;
 $("#dashArtists").textContent=artists.length;
 $("#showFavorites").innerHTML=favoritesOnly?`♡ Show all artists <span>${artists.length}</span>`:`♡ View my favourites <span>${favorites.length}</span>`;
}
function renderBookings(){
 $("#bookingCount").textContent=bookings.length; $("#dashBookings").textContent=bookings.length;
 if(!bookings.length){$("#bookingList").innerHTML='<div class="empty-bookings"><span>♡</span><p>Your next beautiful plan starts here.</p><small>Book an artist to see your appointments here.</small></div>';return;}
 $("#bookingList").innerHTML=bookings.slice().reverse().map(b=>{const a=artists.find(x=>x.id===b.artistId);return `<div class="booking-row"><div><strong>${a?a.name:"Bridal artist"}</strong><small>${b.service}</small></div><div><strong>${b.date}</strong><small>${b.time}</small></div><div><strong>${money(b.price)}</strong><small>${b.package} package</small></div><span class="booking-status">${b.status}</span></div>`}).join("");
}
function updateUI(){renderArtists();renderBookings();saveState();}
function resetFilters(){ $("#searchInput").value="";$("#categoryFilter").value="All";$("#locationFilter").value="All";$("#sortFilter").value="featured";favoritesOnly=false;renderArtists(); }
function toggleFavorite(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];updateUI();showToast(favorites.includes(id)?"Added to your favourites ♡":"Removed from favourites");}

function openModal(content){$("#modalContent").innerHTML=content;$("#modalBackdrop").classList.remove("hidden");document.body.style.overflow="hidden";}
function closeModal(){$("#modalBackdrop").classList.add("hidden");document.body.style.overflow="";activeArtist=null;}
function artistById(id){return artists.find(a=>a.id===Number(id));}
function openDetails(id){
 const a=artistById(id);if(!a)return;activeArtist=a.id;
 openModal(`<div class="eyebrow">${a.category} · ${a.location}</div><h2 id="modalTitle">${a.name}</h2><p class="modal-intro">A closer look at your potential wedding-day dream team.</p>
 <div class="artist-detail"><img src="${a.image}" alt="${a.name}"><div><div class="detail-rating">★ ${a.rating.toFixed(1)} · ${a.reviews} reviews</div><p class="detail-copy">${a.description}</p><p class="detail-copy">${a.experience} of experience</p><div class="detail-price">Packages from ${a.priceLabel}</div><button class="btn btn-primary" style="margin-top:12px" data-book="${a.id}">Book this artist ↗</button></div></div>
 <h3 class="detail-section-title">Services offered</h3><p class="detail-copy">${a.services.join(" · ")}</p><h3 class="detail-section-title">Portfolio preview</h3><div class="portfolio-row"><img src="${a.image}" alt="Portfolio sample 1"><img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=75" alt="Portfolio sample 2"><img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=75" alt="Portfolio sample 3"></div><h3 class="detail-section-title">Client love</h3>${a.reviewsText.map(r=>`<div class="review-card"><span>★★★★★</span><p>“${r}”</p><strong>Verified-style demo review</strong></div>`).join("")}<button class="btn btn-outline" data-review="${a.id}" style="margin-top:8px">Leave a demo review</button>`);
}
function openBooking(id){
 const a=artistById(id);if(!a)return;activeArtist=a.id;
 const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);const minDate=tomorrow.toISOString().slice(0,10);
 openModal(`<div class="eyebrow">LET'S MAKE IT OFFICIAL</div><h2 id="modalTitle">Book ${a.name}</h2><p class="modal-intro">Choose your service and preferred time. This is a demo booking; no payment is collected.</p>
 <form class="modal-form" id="bookingForm"><div class="form-group full"><label for="bookingService">Service</label><select id="bookingService" required>${a.services.map(s=>`<option>${s}</option>`).join("")}</select></div>
 <div class="form-group"><label for="bookingDate">Preferred date</label><input id="bookingDate" type="date" min="${minDate}" required></div><div class="form-group"><label for="bookingTime">Preferred time</label><select id="bookingTime" required><option>09:00 AM</option><option>11:00 AM</option><option>01:00 PM</option><option>03:00 PM</option><option>05:00 PM</option></select></div>
 <div class="form-group"><label for="bookingPackage">Package</label><select id="bookingPackage"><option value="Essential">Essential · ${money(a.price)}</option><option value="Signature">Signature · ${money(Math.round(a.price*1.5))}</option><option value="Premium">Premium · ${money(a.price*2)}</option></select></div><div class="form-group"><label for="bookingName">Your name</label><input id="bookingName" placeholder="Bride's name" value="${currentUser?.name||""}" required></div>
 <div class="form-group full"><label for="bookingNotes">Notes (optional)</label><textarea id="bookingNotes" placeholder="Tell the artist about your preferred look..."></textarea></div><button class="btn btn-primary" type="submit">Confirm demo booking ↗</button></form>`);
}
function openAuth(mode="login"){
 const register=mode==="register";
 openModal(`<div class="eyebrow">WELCOME TO BRIDALGLOW</div><h2 id="modalTitle">${register?"Create your account":"Welcome back"}</h2><p class="modal-intro">Save favourites and keep your bridal plans in one place.</p><form class="modal-form" id="authForm">${register?'<div class="form-group full"><label for="authName">Full name</label><input id="authName" required placeholder="Your name"></div>':""}<div class="form-group full"><label for="authEmail">Email address</label><input id="authEmail" type="email" required placeholder="you@example.com"></div><div class="form-group full"><label for="authPassword">Password</label><input id="authPassword" type="password" minlength="4" required placeholder="At least 4 characters"></div><button class="btn btn-primary" type="submit">${register?"Create demo account":"Sign in"} ↗</button></form><p class="modal-intro" style="margin:14px 0 0;text-align:center">${register?"Already have an account?":"New to BridalGlow?"} <a href="#" id="switchAuth" style="color:var(--pink-dark);font-weight:700">${register?"Sign in":"Create an account"}</a></p><p class="modal-intro" style="font-size:9px;margin-top:10px">Demo authentication only. Do not enter a real password.</p>`);
}
function openReview(id){
 const a=artistById(id);if(!a)return;
 openModal(`<div class="eyebrow">SHARE A LITTLE LOVE</div><h2 id="modalTitle">Review ${a.name}</h2><p class="modal-intro">Leave a sample review for this prototype.</p><form id="reviewForm" class="modal-form"><div class="form-group full"><label for="reviewRating">Your rating</label><select id="reviewRating"><option value="5">★★★★★ — Loved it</option><option value="4">★★★★ — Great</option><option value="3">★★★ — Good</option><option value="2">★★ — Could be better</option><option value="1">★ — Not for me</option></select></div><div class="form-group full"><label for="reviewText">Your review</label><textarea id="reviewText" required placeholder="Share your experience..."></textarea></div><button class="btn btn-primary" type="submit">Submit demo review</button></form>`);
}

$("#artistGrid").addEventListener("click",e=>{
 const fav=e.target.closest("[data-favorite]"),details=e.target.closest("[data-details]"),book=e.target.closest("[data-book]");
 if(fav)toggleFavorite(Number(fav.dataset.favorite));
 if(details)openDetails(Number(details.dataset.details));
 if(book)openBooking(Number(book.dataset.book));
});
$("#modalContent").addEventListener("click",e=>{
 const book=e.target.closest("[data-book]"),review=e.target.closest("[data-review]");
 if(book)openBooking(Number(book.dataset.book));
 if(review)openReview(Number(review.dataset.review));
 if(e.target.id==="switchAuth"){e.preventDefault();openAuth($("#modalTitle").textContent.includes("account")?"login":"register");}
});
$("#modalContent").addEventListener("submit",e=>{
 if(e.target.id==="bookingForm"){
  e.preventDefault();const a=artistById(activeArtist);if(!a)return;
  const pkg=$("#bookingPackage").value;const price=pkg==="Essential"?a.price:pkg==="Signature"?Math.round(a.price*1.5):a.price*2;
  bookings.push({id:Date.now(),artistId:a.id,service:$("#bookingService").value,date:$("#bookingDate").value,time:$("#bookingTime").value,package:pkg,price,status:"Requested",name:$("#bookingName").value,notes:$("#bookingNotes").value});
  updateUI();closeModal();showToast("Your demo booking has been added to My Bookings ♡");$("#dashboard").scrollIntoView({behavior:"smooth"});
 }
 if(e.target.id==="authForm"){
  e.preventDefault();const email=$("#authEmail").value;const name=$("#authName")?.value||email.split("@")[0];
  currentUser={name,email};saveState();closeModal();$("#loginBtn").textContent=name.split(" ")[0];showToast(`Welcome to BridalGlow, ${name}!`);renderArtists();
 }
 if(e.target.id==="reviewForm"){
  e.preventDefault();closeModal();showToast("Thank you! Your demo review was recorded for this session.");
 }
});
$("#searchInput").addEventListener("input",()=>{favoritesOnly=false;renderArtists();});
["categoryFilter","locationFilter","sortFilter"].forEach(id=>$("#"+id).addEventListener("change",()=>{favoritesOnly=false;renderArtists();}));
$("#resetFilters").addEventListener("click",resetFilters);$("#emptyReset").addEventListener("click",resetFilters);
$("#showFavorites").addEventListener("click",()=>{favoritesOnly=!favoritesOnly;$("#artists").scrollIntoView({behavior:"smooth"});renderArtists();showToast(favoritesOnly?"Showing your saved artists":"Showing all artists");});
$$(".service-card").forEach(card=>card.addEventListener("click",()=>{$("#categoryFilter").value=card.dataset.category;favoritesOnly=false;renderArtists();$("#artists").scrollIntoView({behavior:"smooth"});}));
$("#loginBtn").addEventListener("click",()=>openAuth("login"));$("#joinBtn").addEventListener("click",()=>openAuth("register"));
$("#dashboardBookBtn").addEventListener("click",()=>$("#artists").scrollIntoView({behavior:"smooth"}));
$("#modalClose").addEventListener("click",closeModal);$("#modalBackdrop").addEventListener("click",e=>{if(e.target===$("#modalBackdrop"))closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
$("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");const dark=document.body.classList.contains("dark");localStorage.setItem("bridalGlowDark",dark?"true":"false");$("#themeToggle").textContent=dark?"☀":"☾";});
if(localStorage.getItem("bridalGlowDark")==="true"){document.body.classList.add("dark");$("#themeToggle").textContent="☀";}
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$$(".nav-link").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();showToast("You're on the demo list — thank you!");$("#newsletterForm").reset();});
updateUI();
