import supabase_client from "@/lib/client";
import { NextResponse } from "next/server";



export async function GET() {    
  const { data, error } = await supabase_client.from("clients").select("*");  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
  
}


export async function POST(req: Request) {
  const { name, email, business_name } = await req.json();  

  const { data, error } = await supabase_client
    .from("clients")
    .insert([{ name, email, business_name }])
    .select();

  if (error) {
    console.log("error====> ", error);
    
    return NextResponse.json({ error: error.message }, { status: 500 });
}
  console.log("failed to get ===", error);

  return NextResponse.json({ message: "Client added successfully", data });
}