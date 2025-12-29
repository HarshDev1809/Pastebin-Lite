import { savePaste } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req) {
  try {
    const body = await req.json();
    const { content = null, ttl_seconds = null, max_views = null } = body;
    const testTime = req.headers.get('x-test-now-ms')

    if (!content)
      return Response.json(
        {
          error: "Paste not provided in the payload",
        },
        { status: 404 }
      );

    if (ttl_seconds !== '' && ttl_seconds < 1) {
      return Response.json(
        {
          error: "ttl can't be less than 1",
        },
        { status: 404 }
      );
    }

    if (max_views !== '' && max_views < 1) {
      return Response.json(
        {
          error: "max views can't be less than 1",
        },
        { status: 404 }
      );
    }

    const id = nanoid(10);
    let currentTime = Date.now();

    if(process.env.TEST_MODE === '1' && testTime){
        currentTime = testTime;
    }

    let expiryTime = null

    if(ttl_seconds){
        expiryTime = Number(currentTime) + Number(ttl_seconds) * 1000
    }

    await savePaste(id,content,currentTime,expiryTime,ttl_seconds === '' ? null : ttl_seconds,max_views  === '' ? null : max_views);
    
    return Response.json(
      { message: "Paste saved successfully" ,id,url : `${process.env.NEXT_PUBLIC_APP_URL}/p/${id}`},
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json({ error: error.message }, { status: 500 });
  }
}
