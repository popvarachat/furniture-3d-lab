# เพิ่ม Furniture ใหม่
1. สร้าง branch ใน fork ของทีม เก็บแบบต้นฉบับใน private-inputs/ และกรอก dimension record
2. เพิ่ม catalog ใน src/products/models.js: id, code, name, dims, w, d, h, known, approx, type (w/d/h หน่วยเมตร)
3. เพิ่มเงื่อนไข builder ก่อน final else ใน buildFurniture — final else ปัจจุบันสร้าง Window Seat ไม่ใช่ generic fallback
4. ใช้ part(name, material, description, explosionOffset) แยก subassembly; offset หน่วยเมตร และทุกกลุ่มต้องมี geometry
5. geometry ชิ้นที่เลือกได้ต้องไม่ใช้ material ที่แก้ค่าร่วมกับกลุ่มอื่น
6. ส่วนท้าย builder ของตัวอย่างมี envelope fitting ที่ปรับ root scale ให้ตรงกับกรอบรวม ไม่ใช่การยืนยันมิติรายชิ้น สำหรับ CAD ที่ต้องวัดจริง ให้เลิก fitting และแก้ geometry แทนการกลบส่วนต่าง
7. รัน npm run check และ npm run build แล้วตรวจ browser จริงทั้งแบบประกอบ แยกชิ้นส่วน มุมกล้อง มือถือ และ PNG
8. ตรวจมิติ/จุดยึด/โครงสร้างกับผู้ออกแบบก่อนใช้ผลิต
