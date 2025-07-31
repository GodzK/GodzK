# Supabase Database
จุดเเข็ง : Open Source , Pricing (Fix cost ได้)

-- ภาษาที่จะ init คือ Next Js 

### Step 1  : Make a table
สร้าง table ใหม่ พร้อมตั้งชื่อ เเละกำหนด field ต่างๆ กำหนดประเภทด้วยนะ มันจะมีSQL Editor มันก็จะทำได้เหมือนsql workbench เลย

### Step 2 : Make a storage
ถ้าเราจะupload file เราจะต้องสร้าง bucket มาเก็บไฟล์พวกนั้น (สร้าง public bucket)

### Step 3 : Create Next App
npx create-next-app -e with-supabase

### Step 4 : Env Example
พอผมกดสร้าง create nextapp with supabase เเล้ว มันจะมีไฟล์ .env.exampleเเละนำไปเป็นฐานใน env.local ใกล้ๆ จากนั้นเข้าsupabase web เเล้วเข้าsetting/api ไปเเล้วเอาsupabase มาวาง

### Step 5 : Template Supabase  (God)
มันIntegrate authentication มาให้เเล้ว

### Step 6 : Register Form
    export function register(formData: FormData) {
        const fullname = formData.get('fullname')
        const email = formData.get("email")
        const tel = formData.get("tel")
        console.log(fullname,email,tel);
    }
หลังจากนั้น import action.ts นี้เข้ามา เเละ ดึงaction.register

### Step 7 : ใช้ท่า Supabase

const cookieStore = cookies(); // นำมาอ่านtoken
const supabase = createClient(cookieStore);


    const {data,error} = 
    await supabase  
    .from("users)
    .insert([{
        fullname,
        email,
        tel
    }]);

    if(error){
        console.log(error);
        return false;
    }
    else{
        console.log("Register Successfull")
    }
### Step 8 : Authentication/Policies
Add a policies : ตั้งชื่อว่า public register checkexpression ใส่ true ไป จะsetให้ guest insertข้อมูลได้เท่านั้นเเละ userที่authenเท่านั้นจะสามารถselectดูได้
เเละ สร้างpolicyสำหรับการ setให้ authenเเล้วเท่านั้นที่ upload file เข้าไปได้
โดยชื่อตั้งอะไรก็ได้ เเต่เหมือนการให้ยศdiscordอ่ะ ทำอะไรได้ ทำอะไรไม่ได้บ้าง


### Step 9 : Attached File 📎
ไปเพิ่มcolumn attachment type = text(pathfileนะ)
html file 

    input type="file" name ="attachment"

ในform Register ให้ทำเเบบนี้

    const attachment = formData.get("attachment) as File; //as file for ts


### Step 10 : Upload attachedment file  to bucket

    await supabase.storage.from("attachment").upload("test.png", attachment);
    เเต่ถ้าจะใช้ Handle error ก็ทำเเบบนี้
    const {error} =  await supabase.storage.from("attachments").upload("test.png", attachment);
    if (error){
        console.log('error',error);
        return false
    }
    console.log("Upload Successful)

### Step 11 : เเก้ปัญหาชื่อที่ใส่ supabase มันซ้ำ

    11.1 npm i uuid เเต่อันนี้เป็น typescript ต้องลงเพิ่ม npm install --save @types/uuid
    เข้ามาที่action.ts import {v4 as uuidv4} from "uuid"; เพื่อ generate ชื่อไฟล์ มา 
    fileName = uuidv4();
เเล้วเเก้ส่วนนี้เป็น

     const {error} =  await supabase.storage.from("attachments").upload(fileName, attachment);
     const publicAttachmentUrl = supabase.storage.from('attachment').getPublicUrl(fileName)
     
### Step 12 : get Public Bucket ออกมา
    const publicAttachmentUrl = supabase.storage.from("attachments").getPublicUrl(fileName)
    //ไอ URLนั้นมันคือurlที่จะเปิดไปเจอรูป เเต่มันจะเป็นรูปในbucketนะะ
