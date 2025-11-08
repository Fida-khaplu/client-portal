import { EmailTemplate } from "@/component/emailTemplate";
import supabase_client from "@/lib/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);




export async function GET() {    
  const { data, error } = await supabase_client.from("clients").select("*");  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
  
}


export async function POST(req: Request) {
  try {
    const { name, email, business_name } = await req.json();

    const { data: existingClient, error: fetchError } = await supabase_client
      .from("clients")
      .select("*")
      .eq("email", email)
      .single(); // single() returns null if no match

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 means no rows found, which is fine
      console.error("Supabase fetch error:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (existingClient) {
      // Email already exists
      return NextResponse.json({ message: "Client already exists" }, { status: 400 });
    }

    const { data: newClient, error: insertError } = await supabase_client
      .from("clients")
      .insert([{ name, email, business_name }])
      .select();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    try {
      const emailResponse = await resend.emails.send({
        from: "Client-Portal <onboarding@resend.dev>",
        to: [email], 
        subject: "Welcome to Client Portal!",
        react: EmailTemplate({ name: name }),
      });

      console.log("Email sent:", emailResponse);
    } catch (resendError) {
      console.error("Resend error:", resendError);
      // You can choose to continue or fail here
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // 4️⃣ Return success response
    return NextResponse.json({
      message: "Client added successfully",
      data: newClient,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}