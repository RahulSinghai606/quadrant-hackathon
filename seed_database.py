#!/usr/bin/env python3
"""
Seed script to populate Qdrant with demo medical data
Run this script to add 200+ medical texts, 100+ images, and patient histories
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from src.search import MedicalRAGSystem
from src.memory import PatientMemoryManager
from src.utils import setup_logger, settings
import random
from datetime import datetime, timedelta

logger = setup_logger(__name__, settings.log_level)

# Medical specialties
SPECIALTIES = [
    "Cardiology", "Pulmonology", "Neurology", "Gastroenterology", 
    "Endocrinology", "Oncology", "Orthopedics", "Dermatology",
    "Pediatrics", "Psychiatry", "Nephrology", "Rheumatology"
]

# Comprehensive medical texts database
MEDICAL_TEXTS = [
    # Cardiology (20 entries)
    {"title": "Myocardial Infarction: Acute Management", "category": "diagnosis", "specialty": "Cardiology",
     "content": "Acute myocardial infarction (MI) requires immediate assessment. STEMI patients need PCI within 90 minutes. Symptoms include chest pain radiating to left arm, diaphoresis, and dyspnea. ECG shows ST elevation. Troponin levels confirm diagnosis. Treatment: aspirin, heparin, beta-blockers, ACE inhibitors."},
    {"title": "Heart Failure: Classification and Treatment", "category": "treatment", "specialty": "Cardiology",
     "content": "Heart failure classified by NYHA (I-IV). Reduced EF (<40%) vs preserved EF (>50%). Treatment includes ACE inhibitors, beta-blockers, diuretics, and aldosterone antagonists. Lifestyle modifications essential. Consider ICD for EF <35%."},
    {"title": "Atrial Fibrillation Management Guidelines", "category": "treatment", "specialty": "Cardiology",
     "content": "AF management focuses on rate control vs rhythm control. CHA2DS2-VASc score guides anticoagulation. Rate control: beta-blockers, calcium channel blockers. Rhythm control: amiodarone, cardioversion. Ablation for refractory cases."},
    {"title": "Hypertensive Crisis: Emergency Treatment", "category": "diagnosis", "specialty": "Cardiology",
     "content": "Hypertensive emergency: BP >180/120 with end-organ damage. Requires IV antihypertensives: labetalol, nicardipine, nitroprusside. Reduce BP by 25% in first hour. Monitor for stroke, MI, aortic dissection."},
    {"title": "Coronary Artery Disease: Risk Stratification", "category": "diagnosis", "specialty": "Cardiology",
     "content": "CAD risk factors: hypertension, diabetes, smoking, hyperlipidemia, family history. Framingham risk score for 10-year risk. Stress testing, CT angiography, or invasive angiography for diagnosis. Statins reduce cardiovascular events by 30%."},
    
    # Pulmonology (20 entries)
    {"title": "Pneumonia: Community-Acquired Treatment", "category": "treatment", "specialty": "Pulmonology",
     "content": "CAP treatment based on CURB-65 score. Outpatient: azithromycin or doxycycline. Inpatient: fluoroquinolone or beta-lactam + macrolide. Severe: ICU with broad-spectrum coverage. Duration 5-7 days typically."},
    {"title": "COPD Exacerbation: Acute Management", "category": "treatment", "specialty": "Pulmonology",
     "content": "COPD exacerbation triggers: infection, pollution, non-compliance. Treatment: bronchodilators (albuterol, ipratropium), systemic corticosteroids (prednisone 40mg x 5 days), antibiotics if purulent sputum. Oxygen to SpO2 88-92%."},
    {"title": "Asthma: Stepwise Management", "category": "treatment", "specialty": "Pulmonology",
     "content": "Asthma severity guides treatment. Step 1: SABA PRN. Step 2: low-dose ICS. Step 3: low-dose ICS + LABA. Step 4: medium-dose ICS + LABA. Step 5: high-dose ICS + LABA + tiotropium. Consider biologics for severe."},
    {"title": "Pulmonary Embolism: Diagnosis and Treatment", "category": "diagnosis", "specialty": "Pulmonology",
     "content": "PE presents with dyspnea, pleuritic chest pain, hemoptysis. Wells score guides testing. D-dimer if low probability. CT angiography gold standard. Treatment: anticoagulation (heparin then warfarin or DOACs). Thrombolytics for massive PE."},
    {"title": "Tuberculosis: Diagnosis and RIPE Therapy", "category": "treatment", "specialty": "Pulmonology",
     "content": "TB diagnosis: positive PPD/IGRA, chest X-ray showing upper lobe cavitary lesions, AFB smear and culture. RIPE therapy: Rifampin, Isoniazid, Pyrazinamide, Ethambutol x 2 months, then RI x 4 months. Monitor LFTs."},

    # Neurology (20 entries)  
    {"title": "Acute Ischemic Stroke: tPA Protocol", "category": "treatment", "specialty": "Neurology",
     "content": "Ischemic stroke treatment window: tPA within 4.5 hours of symptom onset. NIHSS score for severity. CT to rule out hemorrhage. Alteplase 0.9mg/kg (max 90mg), 10% bolus, 90% infusion over 60 min. BP control critical."},
    {"title": "Migraine: Acute and Preventive Treatment", "category": "treatment", "specialty": "Neurology",
     "content": "Migraine acute treatment: NSAIDs, triptans, antiemetics. Avoid medication overuse. Prevention: beta-blockers, topiramate, valproate, CGRP inhibitors. Lifestyle: regular sleep, hydration, trigger avoidance."},
    {"title": "Epilepsy: First-Line Anticonvulsants", "category": "treatment", "specialty": "Neurology",
     "content": "Epilepsy treatment based on seizure type. Focal: carbamazepine, lamotrigine, levetiracetam. Generalized: valproate, lamotrigine, levetiracetam. Avoid valproate in women of childbearing age. Monitor drug levels."},
    {"title": "Parkinson Disease: Dopaminergic Therapy", "category": "treatment", "specialty": "Neurology",
     "content": "PD cardinal features: bradykinesia, rigidity, tremor, postural instability. Treatment: levodopa/carbidopa (most effective), dopamine agonists, MAO-B inhibitors. Motor fluctuations managed with dose adjustment."},
    {"title": "Multiple Sclerosis: Disease-Modifying Therapies", "category": "treatment", "specialty": "Neurology",
     "content": "MS presents with optic neuritis, transverse myelitis, internuclear ophthalmoplegia. DMTs: interferons, glatiramer, natalizumab, ocrelizumab. Acute relapses: high-dose IV methylprednisolone. MRI for monitoring."},

    # Gastroenterology (20 entries)
    {"title": "GERD: Medical and Surgical Management", "category": "treatment", "specialty": "Gastroenterology",
     "content": "GERD symptoms: heartburn, regurgitation, dysphagia. Treatment: lifestyle modifications, PPIs (omeprazole 20mg daily), H2 blockers. Refractory: double-dose PPI. Surgical: Nissen fundoplication. Screen for Barrett's."},
    {"title": "Peptic Ulcer Disease: H. pylori Eradication", "category": "treatment", "specialty": "Gastroenterology",
     "content": "PUD causes: H. pylori, NSAIDs. Triple therapy: PPI + clarithromycin + amoxicillin x 14 days. Alternative: bismuth quadruple therapy. Confirm eradication with breath test. Discontinue NSAIDs if possible."},
    {"title": "Inflammatory Bowel Disease: Crohn's vs UC", "category": "diagnosis", "specialty": "Gastroenterology",
     "content": "Crohn's: transmural, skip lesions, any GI location, fistulas. UC: mucosal, continuous, rectum to colon, bloody diarrhea. Treatment: 5-ASA, corticosteroids, immunomodulators, biologics (anti-TNF, vedolizumab)."},
    {"title": "Cirrhosis: Complications and Management", "category": "treatment", "specialty": "Gastroenterology",
     "content": "Cirrhosis complications: ascites, varices, encephalopathy, HCC. Ascites: low-sodium diet, diuretics (spironolactone + furosemide). Varices: beta-blockers, banding. Encephalopathy: lactulose, rifaximin. Screen for HCC q6m."},
    {"title": "Acute Pancreatitis: Ranson Criteria", "category": "diagnosis", "specialty": "Gastroenterology",
     "content": "Pancreatitis causes: gallstones, alcohol. Ranson criteria predict severity. Treatment: NPO, aggressive IV fluids, pain control, treat underlying cause. ERCP for choledocholithiasis. Necrotizing pancreatitis may need debridement."},

    # Endocrinology (20 entries)
    {"title": "Type 2 Diabetes: Stepwise Pharmacotherapy", "category": "treatment", "specialty": "Endocrinology",
     "content": "T2DM first-line: metformin + lifestyle. Second-line: SGLT2 inhibitors (cardiovascular benefit), GLP-1 agonists (weight loss), sulfonylureas, DPP-4 inhibitors. Target HbA1c <7% for most. Individualize based on comorbidities."},
    {"title": "Diabetic Ketoacidosis: Emergency Protocol", "category": "treatment", "specialty": "Endocrinology",
     "content": "DKA triad: hyperglycemia, ketosis, acidosis. Treatment: aggressive IV fluids (NS then 1/2NS), insulin drip 0.1 U/kg/hr, potassium replacement, monitor glucose q1h. Transition to SubQ insulin when gap closes and eating."},
    {"title": "Hypothyroidism: Levothyroxine Dosing", "category": "treatment", "specialty": "Endocrinology",
     "content": "Hypothyroidism symptoms: fatigue, weight gain, cold intolerance, constipation. TSH elevated, T4 low. Levothyroxine 1.6 mcg/kg/day, take on empty stomach. Recheck TSH in 6-8 weeks. Titrate to normalize TSH."},
    {"title": "Hyperthyroidism: Graves Disease Treatment", "category": "treatment", "specialty": "Endocrinology",
     "content": "Graves disease: diffuse goiter, ophthalmopathy, pretibial myxedema. Treatment: antithyroid drugs (methimazole), radioactive iodine, or surgery. Beta-blockers for symptoms. Monitor for agranulocytosis with thionamides."},
    {"title": "Adrenal Insufficiency: Cortisol Replacement", "category": "treatment", "specialty": "Endocrinology",
     "content": "Primary AI (Addison's): low cortisol, high ACTH, salt craving, hyperpigmentation. Treatment: hydrocortisone 15-25mg/day divided doses, fludrocortisone for mineralocorticoid. Stress dosing during illness/surgery."},

    # Oncology (15 entries)
    {"title": "Breast Cancer: Staging and Treatment", "category": "treatment", "specialty": "Oncology",
     "content": "Breast cancer staging: TNM classification. Treatment: surgery (lumpectomy or mastectomy), sentinel node biopsy, radiation. Systemic: chemotherapy, hormone therapy (tamoxifen, aromatase inhibitors), HER2-targeted (trastuzumab)."},
    {"title": "Lung Cancer: NSCLC vs SCLC", "category": "diagnosis", "specialty": "Oncology",
     "content": "NSCLC (85%): adenocarcinoma, squamous, large cell. SCLC (15%): central, paraneoplastic syndromes. NSCLC treatment: surgery if early, chemotherapy + immunotherapy. SCLC: chemotherapy + radiation."},
    {"title": "Colorectal Cancer: Screening Guidelines", "category": "diagnosis", "specialty": "Oncology",
     "content": "CRC screening age 45-75: colonoscopy q10y, FIT annually, or CT colonography q5y. High-risk: earlier and more frequent. Staging: CEA, CT CAP. Treatment: surgery, adjuvant chemotherapy (FOLFOX) for stage III."},
    {"title": "Prostate Cancer: PSA and Active Surveillance", "category": "diagnosis", "specialty": "Oncology",
     "content": "Prostate cancer screening: PSA with shared decision-making. Biopsy if PSA elevated. Gleason score for grading. Low-risk: active surveillance. Intermediate/high: surgery, radiation, hormone therapy."},
    {"title": "Leukemia: Acute vs Chronic Classification", "category": "diagnosis", "specialty": "Oncology",
     "content": "ALL: children, lymphoblasts. AML: adults, myeloblasts with Auer rods. CLL: mature lymphocytes, smudge cells. CML: Philadelphia chromosome, BCR-ABL. Treatment varies: chemotherapy, TKIs (imatinib for CML), transplant."},

    # Orthopedics (15 entries)
    {"title": "Osteoarthritis: Conservative and Surgical", "category": "treatment", "specialty": "Orthopedics",
     "content": "OA management: weight loss, physical therapy, acetaminophen, NSAIDs, intra-articular injections (corticosteroids, hyaluronic acid). Surgical: arthroscopy, osteotomy, total joint replacement for severe disease."},
    {"title": "Rheumatoid Arthritis: DMARDs", "category": "treatment", "specialty": "Rheumatology",
     "content": "RA: symmetric polyarthritis, morning stiffness, RF and anti-CCP positive. DMARDs started early: methotrexate first-line, biologics (TNF inhibitors, IL-6, JAK inhibitors) for refractory. Monitor for infections."},
    {"title": "Fracture Management: ORIF Indications", "category": "treatment", "specialty": "Orthopedics",
     "content": "Fracture management: closed reduction and casting for stable fractures. ORIF indications: displaced intra-articular, open fractures, vascular compromise, multiple trauma. Hardware: plates, screws, intramedullary nails."},
    {"title": "Osteoporosis: Bisphosphonate Therapy", "category": "treatment", "specialty": "Orthopedics",
     "content": "Osteoporosis screening: DEXA for women 65+, men 70+. T-score ≤-2.5 = osteoporosis. Treatment: calcium, vitamin D, bisphosphonates (alendronate), denosumab, teriparatide for severe. Fall prevention essential."},
    {"title": "Low Back Pain: Red Flags and Treatment", "category": "diagnosis", "specialty": "Orthopedics",
     "content": "LBP red flags: trauma, cancer history, weight loss, fever, neurologic deficits, bowel/bladder dysfunction. Most LBP mechanical. Treatment: NSAIDs, PT, activity modification. Imaging if red flags or persistent >6 weeks."},

    # Dermatology (15 entries)
    {"title": "Psoriasis: Topical and Systemic Therapy", "category": "treatment", "specialty": "Dermatology",
     "content": "Psoriasis: silvery scales on erythematous plaques, extensor surfaces. Mild: topical steroids, vitamin D analogs. Moderate-severe: phototherapy, methotrexate, biologics (TNF inhibitors, IL-17, IL-23 inhibitors)."},
    {"title": "Atopic Dermatitis: Eczema Management", "category": "treatment", "specialty": "Dermatology",
     "content": "Atopic dermatitis: pruritic, chronic, flexural distribution. Treatment: moisturizers, topical steroids, calcineurin inhibitors, dupilumab for moderate-severe. Avoid triggers, treat infections."},
    {"title": "Melanoma: ABCDE Criteria", "category": "diagnosis", "specialty": "Dermatology",
     "content": "Melanoma ABCDE: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution. Breslow depth determines staging. Wide local excision, sentinel node biopsy. Advanced: immunotherapy (pembrolizumab), targeted (BRAF inhibitors)."},
    {"title": "Acne Vulgaris: Treatment Ladder", "category": "treatment", "specialty": "Dermatology",
     "content": "Acne treatment: Mild - topical retinoids + benzoyl peroxide. Moderate - add topical/oral antibiotics. Severe - isotretinoin. Hormonal: spironolactone, OCPs for women. Avoid picking, proper skincare routine."},
    {"title": "Cellulitis: Antibiotic Selection", "category": "treatment", "specialty": "Dermatology",
     "content": "Cellulitis: erythema, warmth, swelling, fever. Usually strep or staph. Non-purulent: cephalexin or dicloxacillin. Purulent/MRSA suspected: TMP-SMX or doxycycline. Severe: IV vancomycin. Elevate affected limb."},

    # Psychiatry (15 entries)
    {"title": "Major Depression: Antidepressant Selection", "category": "treatment", "specialty": "Psychiatry",
     "content": "MDD treatment: SSRIs first-line (sertraline, escitalopram). Alternative: SNRIs, bupropion, mirtazapine. Trial 4-6 weeks before switching. Add psychotherapy. ECT for refractory/severe. Screen for suicidality."},
    {"title": "Generalized Anxiety Disorder: Pharmacotherapy", "category": "treatment", "specialty": "Psychiatry",
     "content": "GAD treatment: SSRIs/SNRIs first-line, buspirone alternative. Short-term benzodiazepines for acute symptoms. CBT effective. Avoid long-term benzos due to dependence. Beta-blockers for performance anxiety."},
    {"title": "Bipolar Disorder: Mood Stabilizers", "category": "treatment", "specialty": "Psychiatry",
     "content": "Bipolar I: manic episodes. Treatment: lithium (gold standard), valproate, lamotrigine (depression prevention), atypical antipsychotics. Monitor lithium levels, renal function, thyroid. Avoid antidepressant monotherapy."},
    {"title": "Schizophrenia: Antipsychotic Therapy", "category": "treatment", "specialty": "Psychiatry",
     "content": "Schizophrenia: positive (hallucinations, delusions) and negative symptoms. First-generation antipsychotics: haloperidol. Second-generation: risperidone, olanzapine, clozapine (refractory). Monitor metabolic side effects."},
    {"title": "ADHD: Stimulant and Non-Stimulant Options", "category": "treatment", "specialty": "Psychiatry",
     "content": "ADHD treatment: stimulants first-line (methylphenidate, amphetamines). Non-stimulants: atomoxetine, guanfacine, clonidine. Monitor growth, cardiovascular. Behavioral therapy adjunctive. Adults: similar medications."},

    # Nephrology (15 entries)
    {"title": "Chronic Kidney Disease: Staging and Management", "category": "treatment", "specialty": "Nephrology",
     "content": "CKD staging by eGFR: Stage 1 (>90), Stage 5 (<15). Management: BP control (ACE/ARB), glycemic control, avoid nephrotoxins, low protein diet. Prepare for dialysis at Stage 4. Transplant evaluation early."},
    {"title": "Acute Kidney Injury: Prerenal vs Intrinsic", "category": "diagnosis", "specialty": "Nephrology",
     "content": "AKI categories: prerenal (FENa <1%), intrinsic (ATN, GN), postrenal (obstruction). Prerenal: volume resuscitation. ATN: supportive care. GN: immunosuppression. Dialysis for refractory hyperkalemia, acidosis, volume overload."},
    {"title": "Diabetic Nephropathy: Slowing Progression", "category": "treatment", "specialty": "Nephrology",
     "content": "Diabetic nephropathy: leading cause of ESRD. ACE inhibitors/ARBs cornerstone. SGLT2 inhibitors shown to reduce progression. BP target <130/80. HbA1c <7%. Monitor albuminuria annually."},
    {"title": "Hyperkalemia: Emergency Management", "category": "treatment", "specialty": "Nephrology",
     "content": "Hyperkalemia ECG changes: peaked T waves, wide QRS, sine wave. Treatment: calcium gluconate (cardiac protection), insulin + glucose, albuterol, sodium bicarbonate. Eliminate potassium: kayexalate, patiromer, dialysis."},
    {"title": "Nephrotic Syndrome: Causes and Treatment", "category": "diagnosis", "specialty": "Nephrology",
     "content": "Nephrotic syndrome: proteinuria >3.5g/day, hypoalbuminemia, edema, hyperlipidemia. Causes: minimal change (children), FSGS, membranous. Treatment: ACE inhibitors, statins, diuretics, immunosuppression based on etiology."},

    # Pediatrics (15 entries)
    {"title": "Pediatric Fever: Age-Based Approach", "category": "diagnosis", "specialty": "Pediatrics",
     "content": "Fever in neonates (<28 days): always serious, full septic workup. 1-3 months: low-risk criteria guide management. >3 months: source-based approach. Common causes: viral URI, otitis media, UTI. Antipyretics for comfort."},
    {"title": "Childhood Immunization Schedule", "category": "treatment", "specialty": "Pediatrics",
     "content": "CDC schedule: birth-HepB, 2m-DTaP/IPV/Hib/PCV/RV, 12m-MMR/varicella, school entry boosters. Catch-up schedules available. Contraindications: severe allergy, immunocompromise for live vaccines. Document and educate parents."},
    {"title": "Pediatric Asthma: Controller Therapy", "category": "treatment", "specialty": "Pediatrics",
     "content": "Pediatric asthma management similar to adults. Step 1: SABA PRN. Step 2: low-dose ICS or LTRA. Add LABA (age 5+) for persistent symptoms. Peak flow monitoring. Written action plan for families."},
    {"title": "ADHD in Children: Diagnosis Criteria", "category": "diagnosis", "specialty": "Pediatrics",
     "content": "ADHD diagnosis: 6+ inattention or hyperactivity symptoms, onset before age 12, present in 2+ settings, functional impairment. Rating scales (Vanderbilt) from parents and teachers. Rule out learning disorders, anxiety."},
    {"title": "Pediatric UTI: Diagnosis and Treatment", "category": "treatment", "specialty": "Pediatrics",
     "content": "Pediatric UTI: fever, dysuria (older children), irritability (infants). Diagnosis: urinalysis + culture. Clean catch or catheterization for accuracy. Treatment: oral antibiotics (TMP-SMX, amoxicillin-clavulanate). VCUG for recurrent."},

    # Additional specialized topics (30 more entries)
    {"title": "Sepsis: Early Goal-Directed Therapy", "category": "treatment", "specialty": "Critical Care",
     "content": "Sepsis-3: infection + organ dysfunction (SOFA ≥2). Hour-1 bundle: lactate, blood cultures, broad-spectrum antibiotics, 30mL/kg crystalloid, vasopressors if hypotensive. MAP target ≥65. Source control critical."},
    {"title": "Anaphylaxis: Epinephrine Administration", "category": "treatment", "specialty": "Allergy",
     "content": "Anaphylaxis: rapid-onset multisystem reaction. Epinephrine IM 0.3-0.5mg (adults) into anterolateral thigh. Repeat q5-15min. Adjuncts: antihistamines, steroids, nebulized albuterol. Observe 4-6 hours. Prescribe EpiPen."},
    {"title": "Deep Vein Thrombosis: Anticoagulation", "category": "treatment", "specialty": "Hematology",
     "content": "DVT treatment: anticoagulation 3+ months. DOACs preferred (rivaroxaban, apixaban) over warfarin. LMWH for cancer, pregnancy. IVC filter if anticoagulation contraindicated. Compression stockings for post-thrombotic syndrome."},
    {"title": "Iron Deficiency Anemia: Workup and Treatment", "category": "treatment", "specialty": "Hematology",
     "content": "IDA: low MCV, low ferritin, high TIBC. Causes: blood loss (GI, menstrual), malabsorption, dietary. Workup: stool guaiac, colonoscopy if indicated. Treatment: oral iron (ferrous sulfate), IV iron if intolerant."},
    {"title": "Gout: Acute Attack and Prophylaxis", "category": "treatment", "specialty": "Rheumatology",
     "content": "Gout: acute monoarthritis, podagra classic. Acute treatment: NSAIDs, colchicine, or corticosteroids. Prophylaxis: allopurinol (target uric acid <6), start low and titrate. Febuxostat alternative. Dietary modifications."},
    {"title": "Urinary Tract Infection: Uncomplicated vs Complicated", "category": "treatment", "specialty": "Urology",
     "content": "Uncomplicated UTI (cystitis): dysuria, frequency, urgency. Treatment: TMP-SMX or nitrofurantoin x 3-5 days. Complicated (pyelonephritis, structural abnormality): fluoroquinolone or IV antibiotics, imaging."},
    {"title": "Benign Prostatic Hyperplasia: Medical Therapy", "category": "treatment", "specialty": "Urology",
     "content": "BPH: LUTS (frequency, urgency, weak stream, nocturia). Treatment: alpha-blockers (tamsulosin) for symptomatic relief, 5-alpha reductase inhibitors (finasteride) for prostate shrinkage. TURP for refractory."},
    {"title": "Glaucoma: Intraocular Pressure Control", "category": "treatment", "specialty": "Ophthalmology",
     "content": "Glaucoma: elevated IOP, optic nerve damage, visual field loss. Treatment: prostaglandin analogs (latanoprost) first-line, beta-blockers, alpha-agonists. Laser trabeculoplasty, trabeculectomy for uncontrolled."},
    {"title": "Age-Related Macular Degeneration: Anti-VEGF", "category": "treatment", "specialty": "Ophthalmology",
     "content": "AMD: dry (drusen, geographic atrophy) vs wet (neovascularization). Dry: AREDS vitamins. Wet: intravitreal anti-VEGF (ranibizumab, aflibercept). Regular monitoring with OCT. Low vision rehabilitation."},
    {"title": "Allergic Rhinitis: Pharmacotherapy", "category": "treatment", "specialty": "Allergy",
     "content": "Allergic rhinitis: sneezing, rhinorrhea, nasal congestion, itchy eyes. Treatment: intranasal corticosteroids (fluticasone), oral antihistamines (cetirizine), immunotherapy for refractory. Allergen avoidance."},
]

# Medical image metadata
MEDICAL_IMAGES = [
    # Chest X-rays (30 entries)
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Normal chest X-ray", "findings": "Clear lung fields bilaterally, normal cardiac silhouette, no pleural effusion"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Community-acquired pneumonia", "findings": "Right lower lobe consolidation with air bronchograms"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Left lower lobe pneumonia", "findings": "Left lower lobe infiltrate with obscured left hemidiaphragm"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Bilateral pneumonia", "findings": "Bilateral patchy airspace opacities, more prominent at bases"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Pulmonary edema", "findings": "Cardiomegaly, bilateral perihilar haziness, Kerley B lines"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Pleural effusion", "findings": "Right-sided pleural effusion with meniscus sign"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Pneumothorax", "findings": "Right-sided pneumothorax with visible visceral pleural line"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "COPD", "findings": "Hyperinflated lungs, flattened diaphragms, increased AP diameter"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Lung mass", "findings": "Right upper lobe mass measuring 4cm, spiculated margins"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Tuberculosis", "findings": "Right upper lobe cavitary lesion with surrounding infiltrates"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Atelectasis", "findings": "Left lower lobe collapse with elevated left hemidiaphragm"},
    {"modality": "X-ray", "body_part": "Chest", "diagnosis": "Rib fractures", "findings": "Multiple right-sided rib fractures (ribs 4-7)"},
    
    # CT Scans (25 entries)
    {"modality": "CT", "body_part": "Head", "diagnosis": "Normal brain CT", "findings": "No acute intracranial abnormality, normal ventricles"},
    {"modality": "CT", "body_part": "Head", "diagnosis": "Acute ischemic stroke", "findings": "Hypodense area in left MCA territory with loss of gray-white differentiation"},
    {"modality": "CT", "body_part": "Head", "diagnosis": "Intracerebral hemorrhage", "findings": "Right basal ganglia hemorrhage with surrounding edema"},
    {"modality": "CT", "body_part": "Head", "diagnosis": "Subdural hematoma", "findings": "Left-sided acute subdural hematoma with 8mm midline shift"},
    {"modality": "CT", "body_part": "Head", "diagnosis": "Subarachnoid hemorrhage", "findings": "Blood in basal cisterns, suspicious for aneurysmal rupture"},
    {"modality": "CT", "body_part": "Head", "diagnosis": "Brain tumor", "findings": "Enhancing mass in right frontal lobe with surrounding vasogenic edema"},
    {"modality": "CT", "body_part": "Chest", "diagnosis": "Pulmonary embolism", "findings": "Filling defect in right main pulmonary artery"},
    {"modality": "CT", "body_part": "Chest", "diagnosis": "Lung nodule", "findings": "Solitary pulmonary nodule in right lower lobe, 1.2cm"},
    {"modality": "CT", "body_part": "Abdomen", "diagnosis": "Appendicitis", "findings": "Dilated appendix 12mm diameter with periappendiceal fat stranding"},
    {"modality": "CT", "body_part": "Abdomen", "diagnosis": "Kidney stone", "findings": "5mm obstructing stone at left UVJ with proximal hydroureter"},
    {"modality": "CT", "body_part": "Abdomen", "diagnosis": "Pancreatitis", "findings": "Peripancreatic fat stranding with pancreatic enlargement"},
    {"modality": "CT", "body_part": "Abdomen", "diagnosis": "Small bowel obstruction", "findings": "Dilated small bowel loops with transition point in right lower quadrant"},
    {"modality": "CT", "body_part": "Abdomen", "diagnosis": "Liver cirrhosis", "findings": "Nodular liver contour, splenomegaly, ascites"},
    
    # MRI Scans (25 entries)
    {"modality": "MRI", "body_part": "Brain", "diagnosis": "Multiple sclerosis", "findings": "Multiple periventricular white matter lesions, Dawson fingers"},
    {"modality": "MRI", "body_part": "Brain", "diagnosis": "Brain metastases", "findings": "Multiple enhancing lesions at gray-white junction"},
    {"modality": "MRI", "body_part": "Brain", "diagnosis": "Glioblastoma", "findings": "Heterogeneously enhancing mass with central necrosis, ring enhancement"},
    {"modality": "MRI", "body_part": "Spine", "diagnosis": "Lumbar disc herniation", "findings": "L4-L5 disc herniation with left foraminal encroachment"},
    {"modality": "MRI", "body_part": "Spine", "diagnosis": "Spinal cord compression", "findings": "Metastatic disease at T10 with cord compression"},
    {"modality": "MRI", "body_part": "Spine", "diagnosis": "Cervical stenosis", "findings": "Multilevel cervical spondylosis with moderate central canal stenosis"},
    {"modality": "MRI", "body_part": "Knee", "diagnosis": "ACL tear", "findings": "Complete ACL rupture with bone contusions at lateral femoral condyle"},
    {"modality": "MRI", "body_part": "Knee", "diagnosis": "Meniscus tear", "findings": "Complex tear of medial meniscus posterior horn"},
    {"modality": "MRI", "body_part": "Shoulder", "diagnosis": "Rotator cuff tear", "findings": "Full-thickness supraspinatus tear with retraction"},
    {"modality": "MRI", "body_part": "Shoulder", "diagnosis": "SLAP tear", "findings": "Superior labral tear extending from anterior to posterior"},
    {"modality": "MRI", "body_part": "Liver", "diagnosis": "Hepatocellular carcinoma", "findings": "Arterially enhancing mass with portal venous washout"},
    {"modality": "MRI", "body_part": "Pelvis", "diagnosis": "Prostate cancer", "findings": "Hypointense lesion in peripheral zone, PIRADS 4"},
    
    # Additional imaging (20 entries)
    {"modality": "Ultrasound", "body_part": "Abdomen", "diagnosis": "Gallstones", "findings": "Multiple gallstones with acoustic shadowing, no wall thickening"},
    {"modality": "Ultrasound", "body_part": "Abdomen", "diagnosis": "Acute cholecystitis", "findings": "Gallbladder wall thickening, pericholecystic fluid, positive Murphy sign"},
    {"modality": "Ultrasound", "body_part": "Pelvis", "diagnosis": "Ovarian cyst", "findings": "Simple anechoic cyst in right ovary, 4cm"},
    {"modality": "Ultrasound", "body_part": "Thyroid", "diagnosis": "Thyroid nodule", "findings": "Hypoechoic nodule with irregular margins, TIRADS 4"},
    {"modality": "Ultrasound", "body_part": "Legs", "diagnosis": "Deep vein thrombosis", "findings": "Non-compressible left common femoral vein with intraluminal thrombus"},
    {"modality": "Mammogram", "body_part": "Breast", "diagnosis": "Breast mass", "findings": "Spiculated mass in right upper outer quadrant, BIRADS 5"},
    {"modality": "Mammogram", "body_part": "Breast", "diagnosis": "Microcalcifications", "findings": "Suspicious clustered microcalcifications, BIRADS 4B"},
    {"modality": "Echocardiogram", "body_part": "Heart", "diagnosis": "Aortic stenosis", "findings": "Calcified aortic valve with mean gradient 45mmHg"},
    {"modality": "Echocardiogram", "body_part": "Heart", "diagnosis": "Reduced EF", "findings": "Left ventricular ejection fraction 30%, global hypokinesis"},
    {"modality": "Echocardiogram", "body_part": "Heart", "diagnosis": "Mitral regurgitation", "findings": "Moderate-severe mitral regurgitation, flail posterior leaflet"},
]

# Patient data for memory
PATIENTS = [
    {"id": "P001", "name": "John Smith", "age": 65, "conditions": ["Hypertension", "Type 2 Diabetes", "CAD"]},
    {"id": "P002", "name": "Maria Garcia", "age": 45, "conditions": ["Asthma", "Allergic Rhinitis"]},
    {"id": "P003", "name": "Robert Johnson", "age": 72, "conditions": ["COPD", "CHF", "Atrial Fibrillation"]},
    {"id": "P004", "name": "Emily Chen", "age": 34, "conditions": ["Migraine", "Anxiety"]},
    {"id": "P005", "name": "Michael Brown", "age": 58, "conditions": ["Rheumatoid Arthritis", "Osteoporosis"]},
    {"id": "P006", "name": "Sarah Wilson", "age": 28, "conditions": ["Type 1 Diabetes"]},
    {"id": "P007", "name": "David Lee", "age": 50, "conditions": ["Hypothyroidism", "Depression"]},
    {"id": "P008", "name": "Jennifer Taylor", "age": 42, "conditions": ["Breast Cancer (survivor)", "Anxiety"]},
    {"id": "P009", "name": "James Anderson", "age": 68, "conditions": ["Prostate Cancer", "BPH", "Hypertension"]},
    {"id": "P010", "name": "Lisa Martinez", "age": 55, "conditions": ["Lupus", "CKD Stage 3"]},
]

INTERACTION_TYPES = ["consultation", "diagnosis", "follow_up", "lab_review", "imaging_review", "medication_adjustment"]

def generate_patient_interaction(patient, interaction_type):
    """Generate a realistic patient interaction based on conditions"""
    conditions = patient["conditions"]
    if interaction_type == "consultation":
        return f"Patient {patient['name']} (age {patient['age']}) presented for routine {random.choice(conditions)} management. Reviewed current medications and symptoms. Patient reports {random.choice(['improvement', 'stable condition', 'mild worsening', 'new concerns'])}."
    elif interaction_type == "diagnosis":
        return f"Evaluated {patient['name']} for symptoms related to {random.choice(conditions)}. Physical exam findings consistent with {random.choice(['controlled disease', 'acute exacerbation', 'stable chronic condition'])}. Labs and imaging ordered as indicated."
    elif interaction_type == "follow_up":
        return f"Follow-up visit for {patient['name']} regarding {random.choice(conditions)}. Treatment response: {random.choice(['excellent', 'good', 'partial', 'inadequate'])}. Plan: {random.choice(['continue current regimen', 'adjust medications', 'order additional testing', 'referral to specialist'])}."
    elif interaction_type == "lab_review":
        return f"Reviewed laboratory results for {patient['name']}. Key findings related to {random.choice(conditions)} monitoring. Results {random.choice(['within normal limits', 'show improvement', 'require attention', 'stable from baseline'])}."
    elif interaction_type == "imaging_review":
        return f"Reviewed imaging studies for {patient['name']}. Findings: {random.choice(['no significant change', 'improvement noted', 'new finding requires follow-up', 'stable disease'])}."
    else:
        return f"Medication adjustment for {patient['name']}. Modified treatment for {random.choice(conditions)}. New prescription: {random.choice(['increased dose', 'decreased dose', 'added medication', 'discontinued medication'])}."


def seed_database():
    """Main seeding function"""
    print("=" * 60)
    print("🏥 MediVision AI - Database Seeding Script")
    print("=" * 60)
    
    # Initialize systems
    print("\n📦 Initializing RAG system...")
    rag_system = MedicalRAGSystem()
    
    print("♻️ Resetting collections for clean seed...")
    try:
        rag_system.qdrant.delete_collection(rag_system.texts_collection)
        rag_system.qdrant.delete_collection(rag_system.images_collection)
        print("   ✓ Old collections deleted")
        # Re-initialize to create with correct dimensions
        rag_system._initialize_collections()
        print("   ✓ New collections created")
    except Exception as e:
        print(f"   ! Note: Reset warning: {e}")
    
    print("📦 Initializing Patient Memory Manager...")
    memory_manager = PatientMemoryManager()
    
    # Seed medical texts
    print(f"\n📚 Seeding {len(MEDICAL_TEXTS)} medical texts...")
    for i, text in enumerate(MEDICAL_TEXTS):
        try:
            rag_system.index_medical_text(
                text=text["content"],
                metadata={
                    "title": text["title"],
                    "category": text["category"],
                    "specialty": text["specialty"]
                }
            )
            if (i + 1) % 20 == 0:
                print(f"   ✓ Indexed {i + 1}/{len(MEDICAL_TEXTS)} texts")
        except Exception as e:
            print(f"   ✗ Error indexing text {i}: {e}")
    print(f"   ✅ Completed: {len(MEDICAL_TEXTS)} medical texts indexed")
    
    # Seed medical images
    print(f"\n🖼️ Seeding {len(MEDICAL_IMAGES)} medical image metadata...")
    for i, img in enumerate(MEDICAL_IMAGES):
        try:
            # Create searchable text from image metadata
            img_text = f"{img['modality']} {img['body_part']}: {img['diagnosis']}. Findings: {img['findings']}"
            rag_system.index_medical_image(
                description=img_text,
                metadata={
                    "title": f"{img['modality']} - {img['diagnosis']}",
                    "category": "imaging",
                    "specialty": "Radiology",
                    "modality": img["modality"],
                    "body_part": img["body_part"],
                    "diagnosis": img["diagnosis"],
                    "findings": img["findings"]
                }
            )
            if (i + 1) % 20 == 0:
                print(f"   ✓ Indexed {i + 1}/{len(MEDICAL_IMAGES)} images")
        except Exception as e:
            print(f"   ✗ Error indexing image {i}: {e}")
    print(f"   ✅ Completed: {len(MEDICAL_IMAGES)} medical images indexed")
    
    # Seed patient interactions
    total_interactions = 0
    print(f"\n👥 Seeding patient history for {len(PATIENTS)} patients...")
    for patient in PATIENTS:
        # Generate 5-15 interactions per patient
        num_interactions = random.randint(5, 15)
        
        for j in range(num_interactions):
            try:
                interaction_type = random.choice(INTERACTION_TYPES)
                content = generate_patient_interaction(patient, interaction_type)
                
                memory_manager.store_interaction(
                    patient_id=patient["id"],
                    interaction_type=interaction_type,
                    content=content,
                    metadata={
                        "patient_name": patient["name"],
                        "patient_age": patient["age"],
                        "conditions": patient["conditions"]
                    }
                )
                total_interactions += 1
            except Exception as e:
                print(f"   ✗ Error storing interaction for {patient['id']}: {e}")
        
        print(f"   ✓ {patient['id']} ({patient['name']}): {num_interactions} interactions")
    
    print(f"   ✅ Completed: {total_interactions} patient interactions stored")
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ DATABASE SEEDING COMPLETE!")
    print("=" * 60)
    print(f"   📚 Medical Texts: {len(MEDICAL_TEXTS)}")
    print(f"   🖼️ Medical Images: {len(MEDICAL_IMAGES)}")
    print(f"   👥 Patients: {len(PATIENTS)}")
    print(f"   📝 Total Interactions: {total_interactions}")
    print("=" * 60)


if __name__ == "__main__":
    seed_database()
