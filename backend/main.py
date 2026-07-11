"""
ShieldLens API - Core Analytical Engine
Multimodal Analysis Pipeline Against Printed Social Engineering & Phishing URLs.
"""

import os
import io
import cv2
import numpy as np
from pathlib import Path
from PIL import Image
from dotenv import load_dotenv
from qreader import QReader
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# Initialize directory anchors and resolve environmental data pipelines
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

app = FastAPI(
    title="ShieldLens API", 
    description="Multimodal Analysis Engine Against Printed Social Engineering & Phishing Attacks",
    version="1.0.0"
)

# =====================================================================
# INFRASTRUCTURE LAYER: CORS MANAGEMENT
# =====================================================================
# Allows clean asynchronous cross-origin handshakes with your frontend suite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiates official Google GenAI Client wrapper (Leveraging Gemini 2.5 Flash)
client = genai.Client()

# Initialize the lightweight local computer-vision open-source QR decoder engine
qr_reader = QReader()


# =====================================================================
# DATA LAYER: MODEL SCHEMA CONTRACTS (Single Responsibility Principle)
# =====================================================================
class ScamIndicator(BaseModel):
    category: str = Field(description="The primary category of the deceptive social engineering vector found (e.g. 'Urgent Manipulation', 'Brand Impersonation', 'Lack of Context').")
    evidence: str = Field(description="The explicit textual string snippet or specific visual marker captured on camera that supports this alert.")
    explanation: str = Field(description="A clear, accessible, developer-friendly explanation detailing why this indicator poses a structural security risk to the user.")

class FraudAssessmentReport(BaseModel):
    safety_score: int = Field(description="Overall situational confidence assessment rating scaling strictly from 1 to 100, where 100 is pristine absolute safety and 1 indicates an active ongoing fraud attempt.")
    risk_level: str = Field(description="Normalized categorization matching threats exactly to these strings: 'SAFE', 'WARNING', or 'DANGER'.")
    qr_link_extracted: str = Field(description="The target destination URL resolved programmatically by the local QR engine or directly passed. If no physical matrix tag is detected, return 'Not Detected'.")
    brand_impersonated: str = Field(description="The identity profile of the commercial entity, government body, or institutional system being mocked or spoofed (e.g., 'Google', 'Bank of America', 'None').")
    psychological_trick: str = Field(description="Concise description mapping the underlying psychological coercion tricks applied to force user compliance (e.g. fear, artificial urgency).")
    indicators_found: list[ScamIndicator] = Field(description="A comprehensive nested checklist collection detailing all micro-indicators intercepted in layout typography or iconography.")
    action_advice: str = Field(description="Direct, explicit, protective operational command directives tailored for immediate real-world response execution (e.g., 'Dispose of this leaflet immediately. Do not browse to the link.').")


# =====================================================================
# BUSINESS LOGIC LAYER: MULTIMEDIA PROXY PROCESSING (SoC)
# =====================================================================
def extract_qr_link_locally(image_bytes: bytes) -> str:
    """
    Applies mathematical transformations to pixel maps to intercept embedded QR tags.
    Isolates local edge vision layers from complex cloud AI calls to enhance execution performance.
    """
    try:
        # Re-encode raw data array vectors into an operational RGB Pillow canvas profile
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        open_cv_image = np.array(pil_image)
        
        # QReader processing handles pure structural numpy matrices smoothly
        decoded_links = qr_reader.detect_and_decode(image=open_cv_image)
        
        # Filter dead array indices to parse out the first clean string payload
        valid_links = [link for link in decoded_links if link]
        return valid_links[0] if valid_links else "Not Detected"
    except Exception:
        return "Not Detected"


# =====================================================================
# CONTROLLER LAYER: APPLICATION ORCHESTRATION PIPELINES
# =====================================================================
@app.post("/api/v1/shield-scan", response_model=FraudAssessmentReport)
async def analyze_printed_scam(
    file: UploadFile = File(None),
    direct_url: str = Form(None)
):
    """
    Master Audit Pipeline Endpoint. Polymorphic entry: accepts multi-source visual documents
    or direct textual URL input strings. Uses Gemini Multimodal schemas to diagnose threat indicators.
    """
    raw_image_bytes = None
    target_link = "Not Detected"
    origin_context = ""

    # Pipeline Branch A: Input was processed as an Image file (Click, Drag, Paste Binaries)
    if file is not None:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="The submitted asset block must map strictly to a standard valid image type.")
        
        raw_image_bytes = await file.read()
        target_link = extract_qr_link_locally(raw_image_bytes)
        origin_context = (
            f"This request comes from a physical street flyer or document photograph capture. "
            f"Infrastructure scan note: Our embedded local computer vision intercepted that this "
            f"document points to or embeds the following QR destination link: '{target_link}'. Use this data "
            f"to cross-reference domain validity against visual markers."
        )

    # Pipeline Branch B: Input was dispatched directly as plain text payload (Raw URL string)
    elif direct_url is not None:
        target_link = direct_url
        origin_context = (
            f"This request is a direct audit on a raw textual URL address string submitted by the user: '{target_link}'. "
            f"There is no physical paper image attached. Focus your cyber analysis heavily on checking this URL structure, "
            f"detecting subdomain manipulation, phishing signatures, and credential harvesting anomalies."
        )
    
    else:
        raise HTTPException(status_code=400, detail="Incomplete operational parameters. Provide an image file or a direct_url string field.")

    # Establish global expert behavior framework guidelines
    system_instruction = (
        "You are ShieldLens, a high-fidelity expert security framework specializing in offensive cybersecurity, "
        "social engineering diagnostics, and the psychology of persuasion. Your mission is to shield citizens (B2C) "
        "by inspecting image captures of physical leaflets or directly evaluating digital URL links. Scrutinize the target "
        "asset context for psychological triggers, domain spoofing, cloned credentials zones, and engineering anomalies. "
        "Format your entire answer output structure strictly inside the provided JSON object architecture. Maintain direct, "
        "objective, highly protective communication styling strictly in the English language."
    )

    prompt = (
        f"Perform a comprehensive deep-dive forensic audit on this target channel data asset. \n"
        f"Operational Context Pipeline: {origin_context} \n"
        f"Correlate all parameters directly to determine safety scores and action guidance."
    )

    try:
        contents_payload = [prompt]
        if raw_image_bytes:
            image_payload = types.Part.from_bytes(data=raw_image_bytes, mime_type=file.content_type)
            contents_payload.append(image_payload)

        # High-performance asynchronous content generation query invocation with Gemini 2.5 Flash
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents_payload,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=FraudAssessmentReport,
                temperature=0.15
            ),
        )

        return FraudAssessmentReport.model_validate_json(response.text)

    except genai.errors.APIError as api_err:
        raise HTTPException(status_code=502, detail=f"External cloud AI framework routing communication fault: {str(api_err)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal core engine pipeline orchestration exception: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
