"""
Demo data generator for MediVision AI
"""
from typing import List, Dict, Any

# Sample medical knowledge base
MEDICAL_TEXTS = [
    {
        "title": "Pneumonia: Diagnosis and Management",
        "content": """Pneumonia is an infection that inflames the air sacs in one or both lungs.
        Symptoms include cough with phlegm, fever, chills, and difficulty breathing.
        Diagnosis typically involves chest X-ray, blood tests, and sputum culture.
        Treatment depends on the cause but often includes antibiotics for bacterial pneumonia.
        Key diagnostic criteria: fever >38°C, productive cough, chest pain, dyspnea, and
        abnormal lung sounds. Chest X-ray showing infiltrates is confirmatory.""",
        "category": "diagnosis",
        "specialty": "pulmonology",
        "source": "Medical Guidelines Database",
    },
    {
        "title": "Type 2 Diabetes: Clinical Guidelines",
        "content": """Type 2 diabetes is a chronic condition affecting glucose metabolism.
        Diagnostic criteria: Fasting plasma glucose ≥126 mg/dL or HbA1c ≥6.5%.
        Symptoms include increased thirst, frequent urination, fatigue, and blurred vision.
        First-line treatment is lifestyle modification and metformin.
        Complications include cardiovascular disease, neuropathy, nephropathy, and retinopathy.
        Regular monitoring of blood glucose, HbA1c, and kidney function is essential.""",
        "category": "diagnosis",
        "specialty": "endocrinology",
        "source": "Diabetes Association Guidelines",
    },
    {
        "title": "Hypertension: Screening and Management",
        "content": """Hypertension (high blood pressure) is defined as BP ≥130/80 mmHg.
        Often asymptomatic, it's a major risk factor for stroke and heart disease.
        Diagnosis requires multiple BP measurements on different occasions.
        Treatment includes lifestyle modifications (diet, exercise, weight loss) and
        antihypertensive medications. First-line drugs include ACE inhibitors, ARBs,
        calcium channel blockers, and thiazide diuretics. Regular monitoring is crucial.""",
        "category": "diagnosis",
        "specialty": "cardiology",
        "source": "Cardiology Association Guidelines",
    },
    {
        "title": "COVID-19: Diagnosis and Treatment Protocol",
        "content": """COVID-19 is caused by SARS-CoV-2 virus. Symptoms range from mild
        (fever, cough, fatigue) to severe (pneumonia, ARDS). Diagnosis via RT-PCR or
        rapid antigen test. Mild cases: supportive care at home. Severe cases:
        hospitalization, oxygen therapy, antivirals (remdesivir), and corticosteroids.
        Risk factors for severe disease: age >65, obesity, diabetes, cardiovascular disease.
        Vaccination is the primary prevention strategy.""",
        "category": "diagnosis",
        "specialty": "infectious disease",
        "source": "WHO Clinical Guidelines",
    },
    {
        "title": "Migraine: Diagnosis and Treatment",
        "content": """Migraine is a neurological condition characterized by recurrent headaches.
        Symptoms: unilateral throbbing headache, nausea, photophobia, and phonophobia.
        Diagnosis is clinical based on ICHD-3 criteria. Acute treatment: NSAIDs, triptans.
        Preventive treatment for chronic migraine: beta-blockers, anticonvulsants,
        CGRP inhibitors. Lifestyle modifications include regular sleep, stress management,
        and identifying/avoiding triggers.""",
        "category": "diagnosis",
        "specialty": "neurology",
        "source": "Headache Society Guidelines",
    },
    {
        "title": "Pneumonia: Antibiotic Treatment Guidelines",
        "content": """Community-acquired pneumonia (CAP) treatment: First-line for outpatients
        without comorbidities is amoxicillin or doxycycline. For patients with comorbidities,
        use amoxicillin-clavulanate or respiratory fluoroquinolone. Hospitalized patients:
        beta-lactam plus macrolide or respiratory fluoroquinolone. Severe CAP:
        beta-lactam plus azithromycin or fluoroquinolone, consider ICU admission.
        Duration: 5-7 days for most cases. Monitor clinical response at 48-72 hours.""",
        "category": "treatment",
        "specialty": "pulmonology",
        "source": "Infectious Disease Society Guidelines",
    },
    {
        "title": "Type 2 Diabetes: Treatment Algorithm",
        "content": """Step 1: Lifestyle modification and metformin. Step 2: If HbA1c target
        not met, add second agent based on patient factors. With ASCVD or CKD: add GLP-1 RA
        or SGLT2i. With heart failure: add SGLT2i. Cost is concern: add sulfonylurea or
        thiazolidinedione. Step 3: Triple therapy or insulin. Target HbA1c <7% for most
        adults. Monitor for hypoglycemia, especially with insulin or sulfonylureas.
        Regular screening for complications (retinopathy, nephropathy, neuropathy).""",
        "category": "treatment",
        "specialty": "endocrinology",
        "source": "Endocrine Society Treatment Protocol",
    },
    {
        "title": "Hypertension: Medication Selection Guide",
        "content": """First-line agents for hypertension: ACE inhibitors (ramipril, lisinopril),
        ARBs (losartan, valsartan), CCBs (amlodipine, diltiazem), thiazide diuretics
        (hydrochlorothiazide). Black patients: start with CCB or thiazide. CKD patients:
        ACE inhibitor or ARB. Post-MI patients: beta-blocker and ACE inhibitor.
        Combination therapy often needed for BP >150/95. Target BP <130/80 for most adults.
        Monitor electrolytes with diuretics, renal function with ACE/ARB, heart rate with beta-blockers.""",
        "category": "treatment",
        "specialty": "cardiology",
        "source": "Hypertension Management Guidelines",
    },
]

# Sample patient scenarios
DEMO_PATIENTS = [
    {
        "patient_id": "P001",
        "name": "John Smith",
        "age": 45,
        "gender": "male",
        "history": [
            {
                "timestamp": "2024-01-15T10:30:00",
                "type": "consultation",
                "content": "Patient presented with persistent cough and fever for 5 days. Temperature 38.5°C. No known allergies.",
            },
            {
                "timestamp": "2024-01-20T14:00:00",
                "type": "follow_up",
                "content": "Follow-up visit: Cough improving with antibiotics. Temperature normal. Continue treatment for 7 days total.",
            },
        ],
    },
    {
        "patient_id": "P002",
        "name": "Sarah Johnson",
        "age": 62,
        "gender": "female",
        "history": [
            {
                "timestamp": "2024-02-01T09:00:00",
                "type": "consultation",
                "content": "Annual checkup. Patient reports increased thirst and frequent urination. Random blood glucose 205 mg/dL.",
            },
            {
                "timestamp": "2024-02-08T11:00:00",
                "type": "diagnosis",
                "content": "Fasting glucose 135 mg/dL. HbA1c 7.2%. Diagnosed with Type 2 Diabetes. Started on metformin 500mg BID.",
            },
        ],
    },
]

# Sample symptoms for demo
DEMO_SYMPTOMS = [
    {
        "id": "S001",
        "description": "Patient reports productive cough with yellow sputum, fever (39°C), shortness of breath, and chest pain when breathing deeply. Symptoms started 4 days ago.",
        "expected_diagnosis": "Community-Acquired Pneumonia",
    },
    {
        "id": "S002",
        "description": "Patient complains of severe unilateral throbbing headache lasting 6 hours, associated with nausea and sensitivity to light and sound. Has history of similar episodes monthly.",
        "expected_diagnosis": "Migraine",
    },
    {
        "id": "S003",
        "description": "Patient reports increased thirst, frequent urination (especially at night), unexplained weight loss of 15 lbs in 2 months, and persistent fatigue. No fever.",
        "expected_diagnosis": "Possible Type 2 Diabetes",
    },
]


def get_medical_texts() -> List[Dict[str, Any]]:
    """Get sample medical texts for indexing"""
    return MEDICAL_TEXTS


def get_demo_patients() -> List[Dict[str, Any]]:
    """Get demo patient data"""
    return DEMO_PATIENTS


def get_demo_symptoms() -> List[Dict[str, Any]]:
    """Get demo symptom scenarios"""
    return DEMO_SYMPTOMS
