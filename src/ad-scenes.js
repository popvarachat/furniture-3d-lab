export const adScenes=[
{id:'studio',name:'สตูดิโอเรียบ',note:'พื้นเรียบ เน้นสินค้าและรายละเอียด',background:'#f3f0e8'},
{id:'living',name:'ห้องนั่งเล่นอบอุ่น',note:'ผนังโทนอุ่น พรม และโคมไฟ เหมาะกับโต๊ะและเดย์เบด',background:'#eee7db'},
{id:'hotel',name:'ล็อบบี้โรงแรม',note:'ผนังเข้ม เส้นทอง และพื้นหิน เหมาะกับงานรับรองและ Luggage Rack',background:'#eee9e0'},
{id:'window',name:'มุมหน้าต่างรับแสง',note:'กระจกบานใหญ่และต้นไม้ เหมาะกับ Window Seat และ Daybed',background:'#edf1ed'},
{id:'terrace',name:'ระเบียงสวน',note:'ฉากตกแต่งจำลอง ไม่ได้ยืนยันว่าสินค้าใช้กลางแจ้งได้',background:'#ecf0e4'}
];
export function recommendScene(id){return ({round950:'living',luggage:'hotel',daybed:'window',rect1100:'living',side550:'hotel',window:'window'})[id]||'studio';}
export function resolveScene(id){return adScenes.find(s=>s.id===id)||adScenes[0];}
