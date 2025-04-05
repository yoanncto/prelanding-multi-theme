/**
 * Handles POST requests to /api/submit
 * - Receives form data from the landing page.
 * - Sends lead data to Keitaro update endpoint.
 * - Redirects the user to the next step (likely back to Keitaro to handle final offer redirect).
 */
export async function onRequestPost(context) {
    try {
      const { request, env } = context; // Get request object and environment variables
  
      // --- Configuration (Get from Environment Variables) ---
      // IMPORTANT: Set these in your Cloudflare Pages project settings!
      const keitaroTrackerDomain = env.KEITARO_TRACKER_DOMAIN; // e.g., "your-tracker.com" (NO https://)
      // Optional: Define the final offer URL here if needed, or rely on Keitaro's postback redirect
      // const finalOfferUrl = env.FINAL_OFFER_URL;
  
      if (!keitaroTrackerDomain) {
        console.error("KEITARO_TRACKER_DOMAIN environment variable is not set.");
        return new Response("Server configuration error.", { status: 500 });
      }
  
      // --- Parse Form Data ---
      const formData = await request.formData();
      const clickid = formData.get('clickid');
      const firstName = formData.get('firstName');
      const lastName = formData.get('lastName');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const address = formData.get('address');
      const zipcode = formData.get('zipcode');
      const city = formData.get('city');
      const token = formData.get('token');

      // Add any other form fields you need (city, etc.)
      // const city = formData.get('city');
  
      // Basic validation
      if (!clickid || !email) { // Add more checks as needed
        console.error("Missing required form data (clickid or email).");
        // Optionally redirect back to form with error message
        return new Response("Missing required information.", { status: 400 });
      }
  
      // --- Construct Keitaro Update URL ---
      // Using the /postback endpoint is common to update params and potentially trigger offer redirect
      // Consult Keitaro docs if a different endpoint is preferred for updating click data
      let keitaroUpdateUrl = `https://${keitaroTrackerDomain}/postback?subid=${clickid}&status=lead&cost=0`; // Mark as lead
      keitaroUpdateUrl += `&firstName=${encodeURIComponent(firstName || '')}`;
      keitaroUpdateUrl += `&lastName=${encodeURIComponent(lastName || '')}`;
      keitaroUpdateUrl += `&email=${encodeURIComponent(email || '')}`;
      keitaroUpdateUrl += `&phone=${encodeURIComponent(phone || '')}`;
      keitaroUpdateUrl += `&address=${encodeURIComponent(address || '')}`;
      keitaroUpdateUrl += `&zipcode=${encodeURIComponent(zipcode || '')}`;
      // Add other parameters as needed...
      keitaroUpdateUrl += `&city=${encodeURIComponent(city || '')}`;
  
      console.log(`Sending update to Keitaro for click ${clickid}`); // Log before sending
  
      // --- Send Data to Keitaro (Server-to-Server) ---
      const keitaroResponse = await fetch(keitaroUpdateUrl, { method: 'GET' }); // Usually GET for postback/update URLs
  
      // Optional: Check Keitaro's response
      if (!keitaroResponse.ok) {
        console.error(`Keitaro update failed for click ${clickid}. Status: ${keitaroResponse.status}`);
        // Decide how to handle failure: maybe still redirect, or show error
        // Log response body if helpful: const errorBody = await keitaroResponse.text(); console.error(errorBody);
      } else {
        console.log(`Keitaro update successful for click ${clickid}. Status: ${keitaroResponse.status}`);
      }
  
      // --- Redirect User to Next Step ---
      // **Option 1 (Recommended): Redirect back to Keitaro's base click URL.**
      // Keitaro should then see the updated click data and perform its configured
      // redirect to the final Offer URL (which includes prefill macros).
      //const finalRedirectUrl = `https://${keitaroTrackerDomain}/${clickid}/click`;
  
      // **Option 2 (If you need to construct final URL here):**
      // This requires passing Pixel ID, Offer details etc., via Env Vars
      // const pixelId = env.FB_PIXEL_ID;
      // const offerBase = 'https://frst-sw.com/?a=104456&c=395743';
      // let finalRedirectUrl = `${offerBase}&s2=${clickid}&s3=${pixelId}&t1=${encodeURIComponent(firstName)}&t2=...`;
      let finalRedirectUrl = `https://${keitaroTrackerDomain}?_lp=1&token=${token}`;
      console.log(`Redirecting user to: ${finalRedirectUrl}`);
      return Response.redirect(finalRedirectUrl, 302); // Perform the redirect
  
    } catch (error) {
      console.error("Error processing form submission:", error);
      return new Response("An error occurred.", { status: 500 });
    }
  }
  
  // Optional: Add onRequestGet or other handlers if needed for the same route
  // export async function onRequestGet(context) {
  //   return new Response("Please submit the form via POST.", { status: 405 });
  // }