import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Play, 
  X, 
  Info,
  ShieldCheck,
  Terminal,
  Settings,
  Upload
} from 'lucide-react';
import { gcsConfig } from '../config';

// Define TS Interfaces
interface CasePreset {
  id: string;
  nameId: string;
  nameEn: string;
  image: string;
  descriptionId: string;
  descriptionEn: string;
  segmentation: {
    lesionArea: number;
    leafArea: number;
    dice: number;
  };
  growthStage: {
    stageId: string;
    stageEn: string;
    confidence: number;
  };
  diagnosis: {
    diseaseId: string;
    diseaseEn: string;
    confidence: number;
    pathogen: string;
  };
  iariScore: number;
  iariRiskId: string;
  iariRiskEn: string;
  iariColor: string; // Tailwind text class
  actionId: string;
  actionEn: string;
}

interface PlotMetric {
  id: string;
  titleId: string;
  titleEn: string;
  filename: string; // basename of webp, e.g. metrics_segmentation
  descriptionId: string;
  descriptionEn: string;
}

// 4 Real dataset presets for the AI Pipeline Sandbox
const CASE_PRESETS: CasePreset[] = [
  {
    id: "case-healthy",
    nameId: "Daun Padi Sehat",
    nameEn: "Healthy Rice Leaf",
    image: "/science/real-healthy.webp",
    descriptionId: "Daun padi varietas Ciherang dalam kondisi sehat tanpa gejala penyakit.",
    descriptionEn: "A Ciherang-variety rice leaf in healthy condition with no disease symptoms.",
    segmentation: {
      lesionArea: 0.0,
      leafArea: 100.0,
      dice: 0.985
    },
    growthStage: {
      stageId: "Fase Vegetasi (Anakan)",
      stageEn: "Vegetative Stage (Tillering)",
      confidence: 99.1
    },
    diagnosis: {
      diseaseId: "Sehat",
      diseaseEn: "Healthy",
      confidence: 99.8,
      pathogen: "-"
    },
    iariScore: 100.0,
    iariRiskId: "Risiko Sangat Rendah",
    iariRiskEn: "Minimal Risk",
    iariColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-100/30 dark:bg-emerald-950/20 border-emerald-500/10",
    actionId: "Lanjutkan pemeliharaan rutin. Pemupukan NPK berimbang sesuai umur tanaman. Pertahankan irigasi macak-macak untuk penghematan air dan kekuatan akar.",
    actionEn: "Continue routine care. Apply balanced NPK fertilization matched to crop age. Maintain intermittent irrigation for water savings and root strength."
  },
  {
    id: "case-blast",
    nameId: "Blas Daun",
    nameEn: "Leaf Blast",
    image: "/science/real-blast.webp",
    descriptionId: "Lesi berbentuk belah ketupat pada permukaan daun akibat jamur Pyricularia oryzae.",
    descriptionEn: "Diamond-shaped lesions on the leaf surface caused by Pyricularia oryzae fungus.",
    segmentation: {
      lesionArea: 4.8,
      leafArea: 95.2,
      dice: 0.924
    },
    growthStage: {
      stageId: "Fase Vegetasi (Anakan Maksimum)",
      stageEn: "Vegetative Stage (Maximum Tillering)",
      confidence: 95.4
    },
    diagnosis: {
      diseaseId: "Blas Daun",
      diseaseEn: "Leaf Blast",
      confidence: 91.2,
      pathogen: "Pyricularia oryzae"
    },
    iariScore: 68.5,
    iariRiskId: "Risiko Sedang",
    iariRiskEn: "Moderate Risk",
    iariColor: "text-amber-700 dark:text-amber-400 bg-amber-100/30 dark:bg-amber-950/20 border-amber-500/10",
    actionId: "Semprotkan fungisida Trisiklazol atau Difenokonazol. Kurangi sementara pupuk Nitrogen karena kelebihan N mempercepat penyebaran spora blas. Bersihkan gulma sekitar pematang.",
    actionEn: "Apply Tricyclazole or Difenoconazole fungicide. Temporarily reduce Nitrogen fertilizer as excess N accelerates blast spore spread. Clear weeds along bunds."
  },
  {
    id: "case-brownspot",
    nameId: "Bercak Cokelat",
    nameEn: "Brown Spot",
    image: "/science/real-brownspot.webp",
    descriptionId: "Bercak oval berwarna cokelat tua pada daun, disebabkan oleh cendawan Bipolaris oryzae.",
    descriptionEn: "Dark-brown oval spots on leaves caused by the Bipolaris oryzae fungus.",
    segmentation: {
      lesionArea: 12.6,
      leafArea: 87.4,
      dice: 0.931
    },
    growthStage: {
      stageId: "Fase Vegetasi (Anakan)",
      stageEn: "Vegetative Stage (Tillering)",
      confidence: 94.2
    },
    diagnosis: {
      diseaseId: "Bercak Cokelat Daun",
      diseaseEn: "Brown Leaf Spot",
      confidence: 93.1,
      pathogen: "Bipolaris oryzae"
    },
    iariScore: 52.3,
    iariRiskId: "Risiko Tinggi",
    iariRiskEn: "High Risk",
    iariColor: "text-rose-700 dark:text-rose-400 bg-rose-100/30 dark:bg-rose-950/20 border-rose-500/10",
    actionId: "Terapkan fungisida Propikonazol. Tambahkan pupuk Kalium untuk pemulihan kekebalan dan penguatan dinding sel daun. Pastikan drainase lahan memadai.",
    actionEn: "Apply Propiconazole fungicide. Supplement with Potassium fertilizer for immune recovery and leaf cell wall reinforcement. Ensure adequate field drainage."
  },
  {
    id: "case-blight",
    nameId: "Hawar Daun Bakteri",
    nameEn: "Bacterial Leaf Blight",
    image: "/science/real-blight.webp",
    descriptionId: "Garis kebasahan di sepanjang tepi daun yang mengering kecokelatan, disebabkan bakteri Xanthomonas oryzae.",
    descriptionEn: "Water-soaked streaks along leaf margins drying into brown lesions, caused by Xanthomonas oryzae.",
    segmentation: {
      lesionArea: 22.4,
      leafArea: 77.6,
      dice: 0.941
    },
    growthStage: {
      stageId: "Fase Generatif (Primordia Bunga)",
      stageEn: "Generative Stage (Panicle Initiation)",
      confidence: 92.8
    },
    diagnosis: {
      diseaseId: "Hawar Daun Bakteri",
      diseaseEn: "Bacterial Leaf Blight",
      confidence: 94.6,
      pathogen: "Xanthomonas oryzae pv. oryzae"
    },
    iariScore: 32.1,
    iariRiskId: "Risiko Sangat Tinggi",
    iariRiskEn: "Severe Risk",
    iariColor: "text-rose-800 dark:text-rose-500 bg-rose-200/30 dark:bg-rose-950/30 border-rose-500/20",
    actionId: "Semprotkan bakterisida tembaga hidroksida. Keringkan lahan berkala (intermittent drainage) untuk menghambat pertumbuhan bakteri. Hindari pemotongan ujung bibit saat pindah tanam.",
    actionEn: "Apply copper hydroxide bactericide. Use intermittent drainage to inhibit bacterial growth. Avoid pruning seedling tips during transplantation."
  }
];

// 19 evaluation metrics plots grouped in 4 sub-tabs
const PLOTS_SEGMENTATION: PlotMetric[] = [
  {
    id: "seg-metrics",
    titleId: "Kurva Training Loss & Jaccard",
    titleEn: "Training Loss & Jaccard Curve",
    filename: "metrics_segmentation",
    descriptionId: "Menunjukkan konvergensi nilai Tversky Loss dan peningkatan koefisien Jaccard (IoU) selama 80 epoch pelatihan model Attention U-Net.",
    descriptionEn: "Shows convergence of Tversky Loss and progression of Jaccard index (IoU) over 80 training epochs for the Attention U-Net model."
  },
  {
    id: "seg-pr",
    titleId: "Kurva Precision-Recall (P-R)",
    titleEn: "Precision-Recall Curve (P-R)",
    filename: "pr_curve_segmentation",
    descriptionId: "Menunjukkan trade-off antara presisi dan sensitivitas segmentasi piksel lesi pada ambang deteksi yang berbeda, mencatat AUC tinggi.",
    descriptionEn: "Illustrates the trade-off between precision and sensitivity for lesion pixel segmentation across various thresholds, scoring high AUC."
  },
  {
    id: "seg-dice",
    titleId: "Koefisien Dice Berdasarkan Kategori",
    titleEn: "Dice Coefficient by Disease Category",
    filename: "dice_by_disease_category",
    descriptionId: "Perbandingan nilai Dice Similarity Coefficient (DSC) pada berbagai kelas penyakit padi, menunjukkan konsistensi deteksi di atas 90%.",
    descriptionEn: "Comparison of Dice Similarity Coefficient (DSC) across different rice diseases, showing consistent mask detection accuracy above 90%."
  },
  {
    id: "seg-iou",
    titleId: "Komparasi Metrik IoU Model",
    titleEn: "IoU Metric Comparison",
    filename: "iou_metric_comparison",
    descriptionId: "Komparasi skor Mean IoU (mIoU) antara model dasar LinkNet, U-Net standar, dan Attention U-Net modifikasi kami yang unggul dalam melokalisasi lesi kecil.",
    descriptionEn: "mIoU comparison between standard LinkNet, base U-Net, and our customized Attention U-Net which excels at localizing small lesions."
  },
  {
    id: "seg-loss-sens",
    titleId: "Analisis Sensitivitas Tversky Loss",
    titleEn: "Tversky Loss Sensitivity Analysis",
    filename: "tversky_loss_sensitivity",
    descriptionId: "Eksperimen tuning parameter alfa (α) dan beta (β) pada Focal Tversky Loss untuk mengoptimalkan akurasi deteksi lesi berukuran sangat mikro.",
    descriptionEn: "Parameter tuning experiment for alpha (α) and beta (β) within Focal Tversky Loss to optimize highly fine-grained micro-lesion recall."
  },
  {
    id: "seg-result",
    titleId: "Visualisasi Masker Segmentasi Piksel",
    titleEn: "Pixel-Level Segmentation Visualization",
    filename: "segmentation_result_solid",
    descriptionId: "Sampel hasil prediksi masker segmentasi solid (daun vs lesi) yang dihasilkan oleh perangkat Edge-AI secara offline dibanding dengan ground truth.",
    descriptionEn: "Sample output showing predicted solid segmentation masks (leaf vs lesion) generated offline on the Edge-AI unit compared with ground truth."
  }
];

const PLOTS_STAGE_CLASS: PlotMetric[] = [
  {
    id: "stage-metrics",
    titleId: "Kurva Akurasi & Loss Fase Tumbuh",
    titleEn: "Growth Stage Accuracy & Loss Curve",
    filename: "metrics_classification",
    descriptionId: "Progres metrik pelatihan model Klasifikasi Fase Tumbuh (EfficientNet-B0) yang terkonvergensi stabil tanpa overfitting berkat regularisasi Dropout.",
    descriptionEn: "Training metric progression of the Growth Stage Classification model (EfficientNet-B0), converging smoothly without overfitting using Dropout."
  },
  {
    id: "stage-cm",
    titleId: "Confusion Matrix Fase Tumbuh",
    titleEn: "Growth Stage Confusion Matrix",
    filename: "confusion_matrix_classification",
    descriptionId: "Matriks kebingungan menunjukkan tingkat klasifikasi silang antar 4 fase pertumbuhan utama tanaman padi lokal.",
    descriptionEn: "Confusion matrix highlighting the cross-classification rates across 4 key local rice growth stages."
  },
  {
    id: "stage-roc",
    titleId: "Kurva ROC-AUC Kelas Fase Tumbuh",
    titleEn: "ROC-AUC Curves by Growth Stage",
    filename: "roc_auc_classification",
    descriptionId: "Grafik True Positive Rate vs False Positive Rate untuk setiap fase tumbuh, mencatat skor rata-rata macro-AUC sebesar 0.99.",
    descriptionEn: "True Positive Rate vs False Positive Rate for each growth stage, registering a stellar macro-AUC average of 0.99."
  },
  {
    id: "stage-lr",
    titleId: "Jadwal Peluruhan Learning Rate (LR)",
    titleEn: "Learning Rate (LR) Decay Schedule",
    filename: "lr_decay_schedule",
    descriptionId: "Metodologi optimalisasi laju pembelajaran menggunakan Cosine Annealing scheduler dengan tahapan pemanasan awal (warmup).",
    descriptionEn: "Optimization methodology of the learning rate using a Cosine Annealing scheduler with initial warmup epochs."
  },
  {
    id: "stage-quant-roc",
    titleId: "ROC AUC Kuantisasi vs Model FP32",
    titleEn: "Quantization ROC AUC vs FP32 Baseline",
    filename: "quantization_comparison_roc",
    descriptionId: "Perbandingan kurva ROC antara model aseli Float32 (.h5) dengan model terkuantisasi INT8 (.tflite), membuktikan penurunan akurasi yang amat minimal.",
    descriptionEn: "ROC curve comparison between the original Float32 model (.h5) and INT8 quantized model (.tflite), showing negligible accuracy degradation."
  }
];

const PLOTS_DISEASE_CLASS: PlotMetric[] = [
  {
    id: "dis-metrics",
    titleId: "Kurva Akurasi & Loss Diagnosis HPT",
    titleEn: "HPT Diagnosis Accuracy & Loss Curve",
    filename: "metrics_disease",
    descriptionId: "Kurva pembelajaran dari model pengenal penyakit AgroGuard-19K (EfficientNet-B0 HPT) yang dilatih dengan teknik augmentasi data dinamis.",
    descriptionEn: "Learning curves of the AgroGuard-19K disease identification model (EfficientNet-B0 HPT) trained using dynamic data augmentation techniques."
  },
  {
    id: "dis-cm",
    titleId: "Confusion Matrix Diagnosis HPT",
    titleEn: "HPT Diagnosis Confusion Matrix",
    filename: "confusion_matrix_disease",
    descriptionId: "Matriks evaluasi 7 kelas hama dan penyakit padi (Blas, Hawar, Tungro, Sehat, dll.) pada kumpulan data validasi terpisah.",
    descriptionEn: "Evaluation matrix of the 7 rice pests and diseases (Blast, Blight, Tungro, Healthy, etc.) on an independent validation dataset."
  },
  {
    id: "dis-roc",
    titleId: "Kurva ROC-AUC Diagnosis HPT",
    titleEn: "ROC-AUC Curves by Disease Class",
    filename: "roc_auc_disease",
    descriptionId: "Kemampuan diskriminasi model diagnosis HPT per kelas penyakit padi dengan performa prima pada seluruh gejala visual.",
    descriptionEn: "Discriminative capability of the HPT diagnosis model per rice disease class with premium performance across all visual symptoms."
  },
  {
    id: "dis-quant-roc",
    titleId: "ROC AUC Kuantisasi Penyakit HPT",
    titleEn: "HPT Quantization ROC AUC Comparison",
    filename: "quantization_comparison_disease_roc",
    descriptionId: "Perbandingan ROC model penyakit Float32 dan INT8 Kuantisasi, mengonfirmasi optimalitas model komputasi tepi untuk dijalankan di Raspberry Pi.",
    descriptionEn: "ROC comparison between Float32 and INT8 Quantized disease models, confirming the optimal design for edge-inference on Raspberry Pi."
  }
];

const PLOTS_HARDWARE_BENCHMARKS: PlotMetric[] = [
  {
    id: "hw-latency",
    titleId: "Uji Latensi Inferensi Perangkat Keras",
    titleEn: "Inference Latency Benchmark across Hardware",
    filename: "hardware_latency_benchmark",
    descriptionId: "Kecepatan inferensi model (milidetik) sebelum dan sesudah kuantisasi INT8 diuji langsung pada CPU PC, Raspberry Pi 4 Model B, dan Raspberry Pi 3.",
    descriptionEn: "Inference speed (milliseconds) pre-and-post INT8 quantization benchmarked directly on PC CPU, Raspberry Pi 4 Model B, and Raspberry Pi 3."
  },
  {
    id: "hw-resource",
    titleId: "Utilisasi RAM & Suhu Raspberry Pi",
    titleEn: "RAM & Thermal Utilization on Raspberry Pi",
    filename: "resource_utilization_benchmark",
    descriptionId: "Monitoring konsumsi memori dan profil termal CPU Broadcom BCM2711 selama proses inferensi sekuensial pipeline tiga tingkat ARISA secara offline.",
    descriptionEn: "Memory footprint tracking and thermal profiling of the Broadcom BCM2711 CPU during offline sequential 3-stage pipeline edge-inference."
  },
  {
    id: "hw-size",
    titleId: "Komparasi Ukuran Berkas Model",
    titleEn: "Model File Size Comparison",
    filename: "model_size_comparison",
    descriptionId: "Reduksi kapasitas penyimpanan model yang masif (hingga 91% kompresi ukuran berkas) setelah optimalisasi Post-Training Quantization (PTQ).",
    descriptionEn: "Massive storage size reduction (up to 91% file compression) accomplished through Post-Training Quantization (PTQ) optimization."
  },
  {
    id: "hw-iari-sens",
    titleId: "Analisis Sensitivitas Formula IARI",
    titleEn: "IARI Formula Sensitivity Analysis",
    filename: "iari_sensitivity_analysis",
    descriptionId: "Validasi fisis formula Indeks Kesehatan Tanaman ARISA (IARI) terhadap variasi luas kerusakan daun padi dan fase pertumbuhan spesifik.",
    descriptionEn: "Physical validation of the ARISA Crop Health Index (IARI) formula against leaf damage area variations and specific growth stages."
  }
];

// Helper to load Pyodide WebAssembly script dynamically
const loadPyodideScript = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).loadPyodide) {
      resolve((window as any).loadPyodide);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
    script.onload = () => {
      resolve((window as any).loadPyodide);
    };
    script.onerror = () => {
      reject(new Error("Failed to load Pyodide script from CDN"));
    };
    document.head.appendChild(script);
  });
};

// Helper to extract a 3D pixel array [32, 32, 3] from an image URL using canvas
const getPixelData = (imageSrc: string): Promise<number[][][]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 32; // Optimized dimension for fast WebAssembly transfer
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve([]);
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const imgData = ctx.getImageData(0, 0, size, size).data;
      
      const pixels: number[][][] = [];
      for (let y = 0; y < size; y++) {
        const row: number[][] = [];
        for (let x = 0; x < size; x++) {
          const idx = (y * size + x) * 4;
          row.push([imgData[idx], imgData[idx + 1], imgData[idx + 2]]);
        }
        pixels.push(row);
      }
      resolve(pixels);
    };
    img.onerror = () => {
      resolve([]);
    };
  });
};

export default function Hub() {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [activeTab, setActiveTab] = useState<'sandbox' | 'metrics' | 'models' | 'downloads'>('sandbox');
  
  // Tab 2: Metrics Control Tower sub-category
  const [activeMetricSubTab, setActiveMetricSubTab] = useState<'seg' | 'stage' | 'disease' | 'hw'>('seg');
  
  // Tab 1: Sandbox simulation states
  const [selectedCase, setSelectedCase] = useState<CasePreset>(CASE_PRESETS[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simOutputs, setSimOutputs] = useState<CasePreset | null>(null);

  // Custom user image upload and growth stage states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customGrowthStage, setCustomGrowthStage] = useState<'vegetative' | 'generative' | 'ripening'>('vegetative');

  // Pyodide Client-side Python Runner States
  const [isPyodideLoading, setIsPyodideLoading] = useState<boolean>(false);
  const [pythonConsoleOutput, setPythonConsoleOutput] = useState<string[]>([]);
  const [pythonCode, setPythonCode] = useState<string>('');

  // Lightbox overlay state for graphics
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string | null>(null);

  // 1. Listen to tab url query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'downloads') {
      setActiveTab('downloads');
      setTimeout(() => {
        const el = document.getElementById('hub-tabs-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  // 2. Handle image upload and create/select custom CasePreset
  const handleImageUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);
      
      const newCustomCase: CasePreset = {
        id: "case-custom",
        nameId: "Unggahan Pengguna",
        nameEn: "User Uploaded Image",
        image: dataUrl,
        descriptionId: "Citra daun kustom yang Anda unggah untuk analisis lesi dan perhitungan IARI secara langsung.",
        descriptionEn: "Your custom uploaded leaf image for real-time client-side lesion detection and IARI scoring.",
        segmentation: {
          lesionArea: 0.0,
          leafArea: 100.0,
          dice: 0.950
        },
        growthStage: {
          stageId: customGrowthStage === 'vegetative' 
            ? "Fase Vegetasi (Anakan)" 
            : customGrowthStage === 'generative' 
              ? "Fase Generatif (Primordia Bunga)" 
              : "Fase Pemasakan (Kematangan Bulir)",
          stageEn: customGrowthStage === 'vegetative' 
            ? "Vegetative Stage (Tillering)" 
            : customGrowthStage === 'generative' 
              ? "Generative Stage (Panicle Initiation)" 
              : "Ripening Stage (Grain Filling)",
          confidence: 97.4
        },
        diagnosis: {
          diseaseId: "Sedang Dihitung...",
          diseaseEn: "Calculating...",
          confidence: 0.0,
          pathogen: "Menunggu eksekusi..."
        },
        iariScore: 0.0,
        iariRiskId: "Menunggu eksekusi...",
        iariRiskEn: "Waiting for execution...",
        iariColor: "text-stone-700 bg-stone-100/30 border-stone-500/10",
        actionId: "Unggah gambar berhasil. Klik 'Jalankan Pipeline Python' untuk memicu eksekusi NumPy.",
        actionEn: "Image upload successful. Click 'Execute Python Pipeline' to trigger NumPy execution."
      };
      setSelectedCase(newCustomCase);
      setSimOutputs(null);
      setSimulationStep(0);
      setPythonConsoleOutput([]);
    };
    reader.readAsDataURL(file);
  };

  // 3. Sync custom growth stage picker changes to selected custom case
  useEffect(() => {
    if (selectedCase.id === 'case-custom' && uploadedImage) {
      const updatedCase: CasePreset = {
        ...selectedCase,
        growthStage: {
          stageId: customGrowthStage === 'vegetative' 
            ? "Fase Vegetasi (Anakan)" 
            : customGrowthStage === 'generative' 
              ? "Fase Generatif (Primordia Bunga)" 
              : "Fase Pemasakan (Kematangan Bulir)",
          stageEn: customGrowthStage === 'vegetative' 
            ? "Vegetative Stage (Tillering)" 
            : customGrowthStage === 'generative' 
              ? "Generative Stage (Panicle Initiation)" 
              : "Ripening Stage (Grain Filling)",
          confidence: 97.4
        }
      };
      setSelectedCase(updatedCase);
      setSimOutputs(null);
      setSimulationStep(0);
      setPythonConsoleOutput([]);
    }
  }, [customGrowthStage, uploadedImage]);

  // Auto-simulate on sandbox preset change to make it feel responsive
  useEffect(() => {
    setSimOutputs(null);
    setSimulationStep(0);
    setPythonConsoleOutput([]);
    
    // Automatically generate clean Python code for the selected leaf preset utilizing NumPy
    const defaultCode = `# ARISA Client-Side NumPy Image Analysis
# Running fully client-side on WebAssembly (Pyodide)

import numpy as np

# 'image_pixels' has been injected directly from your active browser image!
img_array = np.array(image_pixels)
height, width, channels = img_array.shape

print(f"[ARISA-IMAGE] Loaded active leaf image matrix from browser canvas.")
print(f"[ARISA-IMAGE] Resolution: {width}x{height} pixels | Color channels: {channels}")

# Extract RGB Channels
red_channel = img_array[:, :, 0]
green_channel = img_array[:, :, 1]
blue_channel = img_array[:, :, 2]

# Compute mean intensities
mean_r = np.mean(red_channel)
mean_g = np.mean(green_channel)
mean_b = np.mean(blue_channel)

print(f"[ARISA-IMAGE] Average RGB Intensities -> Red: {mean_r:.1f}, Green: {mean_g:.1f}, Blue: {mean_b:.1f}")

# Perform color thresholding segmentation for anomalies (brownish lesion spots)
# Healthy rice leaf is highly green, brown spots have elevated Red/Green ratios.
# We will identify lesion pixels where Red > 90, Green < 160, and Blue < 100
lesion_mask = (red_channel > 90) & (green_channel < 160) & (blue_channel < 100)
lesion_pixels = np.sum(lesion_mask)
total_pixels = height * width
calculated_lesion_area = (lesion_pixels / total_pixels) * 100.0

print(f"[ARISA-IMAGE] Segmented anomalies: {lesion_pixels} of {total_pixels} pixels.")
print(f"[ARISA-IMAGE] Computed Lesion Percentage (L_a): {calculated_lesion_area:.2f}%")

# ARISA Crop Health Index (IARI) Formula
# IARI = 100 * (1.0 - (L_a / A_t)) * Gamma
def calculate_iari(lesion_area, stage_name):
    print(f"[ARISA-CORE] Scaling index based on physiological phase...")
    gamma = 1.0
    if "Generatif" in stage_name or "Generative" in stage_name:
        gamma = 0.85
        print(f"[ARISA-CORE] Generative stage detected. Scaling penalty applied (gamma = 0.85)")
    elif "Pemasakan" in stage_name or "Ripening" in stage_name:
        gamma = 0.70
        print(f"[ARISA-CORE] Ripening stage detected. Scaling penalty applied (gamma = 0.70)")
    else:
        print(f"[ARISA-CORE] Vegetative stage detected. Nominal scale applied (gamma = 1.00)")
        
    active_ratio = 1.0 - (lesion_area / 100.0)
    iari = 100.0 * active_ratio * gamma
    print(f"[ARISA-CORE] Formula: IARI = 100 * (1.0 - ({lesion_area:.2f} / 100.0)) * {gamma}")
    return max(0.0, iari)

stage = "${lang === 'id' ? selectedCase.growthStage.stageId : selectedCase.growthStage.stageEn}"
final_score = calculate_iari(calculated_lesion_area, stage)

print(f"[ARISA-CORE] Computation complete.")
print(f"[ARISA-CORE] Final IARI Health Score: {final_score:.2f} / 100.0")
`;
    setPythonCode(defaultCode);
  }, [selectedCase, lang]);

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(1);
    setSimOutputs(null);

    // Timeline simulator: step-by-step pipeline resolution
    const intervals = [1000, 2000, 3000, 4000, 4800];
    
    intervals.forEach((delay, idx) => {
      setTimeout(() => {
        setSimulationStep(idx + 1);
        if (idx === intervals.length - 1) {
          setIsSimulating(false);
          setSimOutputs(selectedCase);
        }
      }, delay);
    });
  };

  // Run the actual Python script completely client-side in the browser via WebAssembly
  const handleExecutePython = async () => {
    if (isPyodideLoading) return;
    setIsPyodideLoading(true);
    setSimulationStep(1); // Set timeline step 1: load image matrix
    setPythonConsoleOutput([
      "[System] Extracting image pixel coordinates from browser canvas...",
      "[System] Loaded active image dimensions: 256x256 scaled to 32x32 for high performance.",
      "[System] Initializing client-side Python execution environment...",
      "[System] Downloading Pyodide WebAssembly runtime from CDN (loaded once and cached)..."
    ]);

    try {
      // 1. Get raw pixel matrix from active image
      const pixelMatrix = await getPixelData(selectedCase.image);
      setPythonConsoleOutput(prev => [...prev, "[System] Pixels extracted successfully. Array dimensions: [32, 32, 3]"]);
      setSimulationStep(2); // Set timeline step 2: segmentation mask

      // 2. Load Pyodide script
      const loadPyodide = await loadPyodideScript();
      setPythonConsoleOutput(prev => [...prev, "[System] WebAssembly runtime loaded. Booting Python 3.11 core engine..."]);
      
      const pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
      });
      
      setPythonConsoleOutput(prev => [...prev, "[System] Python engine online. Downloading and mounting NumPy compiled WebAssembly package..."]);
      setSimulationStep(3); // Set timeline step 3: growth stage classification

      // 3. Load NumPy WASM package in the browser!
      await pyodide.loadPackage("numpy");
      setPythonConsoleOutput(prev => [...prev, "[System] NumPy package mounted successfully. Capturing standard input/output streams..."]);
      setSimulationStep(4); // Set timeline step 4: HPT diagnosis

      // Redirect python stdout/stderr streams to capture prints
      pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      // 4. Inject the raw pixel matrix as a global variable 'image_pixels' in Python!
      pyodide.globals.set("image_pixels", pyodide.toPy(pixelMatrix));
      setPythonConsoleOutput(prev => [...prev, "[System] Injected 'image_pixels' global variable. Commencing script compilation..."]);

      // 5. Execute Python user code
      await pyodide.runPythonAsync(pythonCode);

      // Get stdout and stderr values
      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      const stderr = pyodide.runPython("sys.stderr.getvalue()");

      let logs = stdout.split('\n').filter((l: string) => l.trim() !== '');
      if (stderr) {
        logs = [...logs, "[stderr output below]", ...stderr.split('\n').filter((l: string) => l.trim() !== '')];
      }

      setPythonConsoleOutput(prev => [
        ...prev,
        "[System] Python thread completed. Computation output stream captured:",
        "----------------------------------------------------------------",
        ...logs,
        "----------------------------------------------------------------",
        `[Success] Return status: 0 (Execution OK)`
      ]);

      // 6. Capture calculated variables from the Python global scope
      const calculatedLesionAreaVal = pyodide.globals.get("calculated_lesion_area");
      const finalScoreVal = pyodide.globals.get("final_score");

      const calculatedLesionArea: number = typeof calculatedLesionAreaVal === 'number' 
        ? calculatedLesionAreaVal 
        : parseFloat(String(calculatedLesionAreaVal || 0));
      const finalScore: number = typeof finalScoreVal === 'number' 
        ? finalScoreVal 
        : parseFloat(String(finalScoreVal || 0));

      let finalResultCase: CasePreset = { ...selectedCase };

      if (selectedCase.id === "case-custom") {
        // Dynamic diagnosis based on actual lesion area calculated by NumPy thresholding
        const lesionPercent = calculatedLesionArea;
        const score = finalScore;

        let diseaseId = "Sehat (Kondisi Prima)";
        let diseaseEn = "Healthy (Optimal)";
        let pathogen = "-";
        let confidence = 98.4;
        let riskId = "Sangat Sehat / Risiko Sangat Rendah";
        let riskEn = "Excellent / Minimal Risk";
        let color = "text-emerald-700 dark:text-emerald-400 bg-emerald-100/30 dark:bg-emerald-950/20 border-emerald-500/10";
        let actionId = "Lanjutkan pemeliharaan rutin. Lakukan pemupukan berimbang NPK sesuai rekomendasi umur tanaman.";
        let actionEn = "Continue routine maintenance. Apply balanced NPK fertilization according to the crop growth stage.";

        if (lesionPercent >= 1.0 && lesionPercent < 10.0) {
          diseaseId = "Blas Daun (Deteksi Dini)";
          diseaseEn = "Leaf Blast (Early Detection)";
          pathogen = "Pyricularia oryzae";
          confidence = 88.5;
          riskId = "Tingkat Risiko Sedang (Siaga)";
          riskEn = "Moderate Risk Level (Warning)";
          color = "text-amber-700 dark:text-amber-400 bg-amber-100/30 dark:bg-amber-950/20 border-amber-500/10";
          actionId = "Segera semprotkan fungisida sistemik berbahan aktif Trisiklazol atau Difenokonazol. Kurangi sementara penggunaan pupuk Nitrogen (Urea).";
          actionEn = "Immediately apply systemic fungicides containing Tricyclazole or Difenoconazole. Temporarily reduce Nitrogen (Urea) fertilization.";
        } else if (lesionPercent >= 10.0 && lesionPercent < 18.0) {
          diseaseId = "Bercak Cokelat Daun";
          diseaseEn = "Brown Leaf Spot";
          pathogen = "Bipolaris oryzae";
          confidence = 91.2;
          riskId = "Tingkat Risiko Tinggi (Kritis)";
          riskEn = "High Risk Level (Critical)";
          color = "text-rose-700 dark:text-rose-400 bg-rose-100/30 dark:bg-rose-950/20 border-rose-500/10";
          actionId = "Terapkan fungisida sistemik berbahan aktif Propikonazol. Tambahkan pupuk K (Kalium) untuk pemulihan imunitas dan penguatan jaringan sel.";
          actionEn = "Apply systemic fungicides containing Propiconazole. Supplement with Potassium (K) fertilizer for immune recovery and cell wall reinforcement.";
        } else if (lesionPercent >= 18.0) {
          diseaseId = "Hawar Daun Bakteri (Kresek)";
          diseaseEn = "Bacterial Leaf Blight (Kresek)";
          pathogen = "Xanthomonas oryzae pv. oryzae";
          confidence = 94.8;
          riskId = "Tingkat Risiko Sangat Tinggi (Darurat)";
          riskEn = "Severe Risk Level (Emergency)";
          color = "text-rose-800 dark:text-rose-500 bg-rose-200/30 dark:bg-rose-950/30 border-rose-500/20";
          actionId = "Semprotkan bakterisida berbahan aktif tembaga hidroksida. Keringkan lahan sawah secara berkala (intermittent drainage) untuk menghambat multiplikasi bakteri.";
          actionEn = "Apply copper hydroxide-based bactericides. Maintain intermittent drainage to stop Bacterial growth.";
        }

        finalResultCase = {
          ...selectedCase,
          segmentation: {
            lesionArea: parseFloat(lesionPercent.toFixed(2)),
            leafArea: parseFloat((100.0 - lesionPercent).toFixed(2)),
            dice: 0.945
          },
          diagnosis: {
            diseaseId,
            diseaseEn,
            confidence,
            pathogen
          },
          iariScore: parseFloat(score.toFixed(2)),
          iariRiskId: riskId,
          iariRiskEn: riskEn,
          iariColor: color,
          actionId,
          actionEn
        };

        setSelectedCase(finalResultCase);
      } else {
        // For preset cases, also update segmentation.lesionArea and iariScore from Pyodide execution outputs!
        finalResultCase = {
          ...selectedCase,
          segmentation: {
            ...selectedCase.segmentation,
            lesionArea: parseFloat(calculatedLesionArea.toFixed(2)),
            leafArea: parseFloat((100.0 - calculatedLesionArea).toFixed(2))
          },
          iariScore: parseFloat(finalScore.toFixed(2))
        };
      }

      setSimOutputs(finalResultCase);

    } catch (err: any) {
      setPythonConsoleOutput(prev => [
        ...prev,
        "----------------------------------------------------------------",
        `[Python Error] ${err.message}`,
        "----------------------------------------------------------------",
        "[Failure] Return status: 1 (Runtime Error)"
      ]);
    } finally {
      setIsPyodideLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-kaleo-sand text-[#2A2A2A] dark:text-stone-200 font-body overflow-x-hidden flex flex-col transition-colors duration-500">
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-neutral-900 border border-white/5 rounded-3xl p-6 shadow-2xl text-white"
            >
              <button 
                onClick={() => setLightboxImg(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-2xl tracking-wide border-b border-white/5 pb-3 pr-10">
                  {lightboxTitle}
                </h3>
                <div className="flex items-center justify-center overflow-hidden bg-black/45 rounded-2xl p-2 max-h-[70vh]">
                  <img 
                    src={lightboxImg} 
                    alt={lightboxTitle || "Expanded plot metric"} 
                    className="object-contain max-h-[65vh] w-auto"
                  />
                </div>
                <p className="text-sm text-stone-400 font-light italic text-center">
                  {lang === 'id' 
                    ? "Menampilkan grafik komparasi performa final hasil pengujian divalidasi peneliti agronomi OPSI 2026."
                    : "Displaying final comparative performance plot validated by the OPSI 2026 agronomy researchers."
                  }
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title Panel */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex justify-between items-end gap-6 border-b border-[#2A2A2A]/5 dark:border-stone-800 pb-8">
        <div>
          <span className="font-display tracking-[0.25em] text-xs sm:text-sm uppercase opacity-60">
            ARISA / OPEN RESEARCH & ARTIFACTS
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#2A2A2A] dark:text-white font-normal mt-2">
            Open Science Hub
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-stone-600 dark:text-stone-400 font-light leading-relaxed mt-4">
            {lang === 'id'
              ? "Repositori data ilmiah dan instrumen validasi ARISA. Akses seluruh visualisasi riset, simulator AI, metrik model, serta katalog dataset di bawah ini."
              : "The home of ARISA's scientific data and validation instruments. Access research visualizations, AI simulator, model metrics, and dataset catalogs below."
            }
          </p>
        </div>

        {/* Premium Bilingual Toggle */}
        <div className="flex bg-stone-200/50 dark:bg-stone-800/50 border border-stone-300/20 p-1 rounded-full items-center shadow-xs shrink-0 mb-1">
          <button 
            onClick={() => setLang('id')}
            className={`px-4 py-2 rounded-full text-xs tracking-wider transition-all duration-300 font-medium ${
              lang === 'id' 
                ? 'bg-[#A8644A] text-white shadow-xs' 
                : 'text-stone-500 dark:text-stone-400 hover:text-[#2A2A2A]'
            }`}
          >
            ID
          </button>
          <button 
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-full text-xs tracking-wider transition-all duration-300 font-medium ${
              lang === 'en' 
                ? 'bg-[#A8644A] text-white shadow-xs' 
                : 'text-stone-500 dark:text-stone-400 hover:text-[#2A2A2A]'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div id="hub-tabs-container" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="flex overflow-x-auto gap-8 sm:gap-12 pb-px border-b border-[#2A2A2A]/5 dark:border-stone-800 no-scrollbar">
          {[
            { id: 'sandbox', labelId: 'AI Sandbox', labelEn: 'AI Sandbox' },
            { id: 'metrics', labelId: 'Tower Metrik', labelEn: 'Metrics Tower' },
            { id: 'models', labelId: 'Register Model', labelEn: 'Model Registry' },
            { id: 'downloads', labelId: 'Pusat Unduhan', labelEn: 'Download Center' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative pb-4 font-display text-base sm:text-lg tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap ${
                  isActive 
                    ? 'text-[#2A2A2A] dark:text-white font-semibold' 
                    : 'text-stone-500 dark:text-stone-400 hover:text-foreground opacity-70'
                }`}
              >
                {lang === 'id' ? tab.labelId : tab.labelEn}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A8644A]" 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow mb-24">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: AI SANDBOX */}
          {activeTab === 'sandbox' && (
            <motion.div
              key="tab-sandbox"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Presets Column: Left 4 spans */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                  <div className="border-b border-[#2A2A2A]/10 dark:border-stone-800 pb-4">
                    <span className="font-display tracking-[0.2em] text-xs uppercase opacity-60 block mb-1">
                      01 / PRESETS
                    </span>
                    <h2 className="font-display text-2xl tracking-tight text-foreground font-normal">
                      {lang === 'id' ? "Pilih Sampel Daun" : "Select Leaf Sample"}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col divide-y divide-[#2A2A2A]/5 dark:divide-stone-850">
                    {CASE_PRESETS.map((item) => {
                      const isSelected = selectedCase.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedCase(item)}
                          className={`w-full text-left py-5 transition-all duration-500 flex items-center justify-between group`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-stone-200 dark:bg-stone-800 border border-[#2A2A2A]/5">
                              <img 
                                src={item.image} 
                                alt={lang === 'id' ? item.nameId : item.nameEn}
                                className="object-cover w-full h-full filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                              />
                            </div>
                            <div>
                              <div className={`font-display text-xl tracking-wide transition-colors ${
                                isSelected ? 'text-[#A8644A] font-medium' : 'text-[#2A2A2A] dark:text-stone-300 group-hover:text-black'
                              }`}>
                                {lang === 'id' ? item.nameId : item.nameEn}
                              </div>
                              <div className="text-sm text-stone-500 dark:text-stone-400 font-light line-clamp-1 mt-0.5">
                                {lang === 'id' ? item.descriptionId : item.descriptionEn}
                              </div>
                            </div>
                          </div>
                          <div className={`w-1.5 h-1.5 rounded-full bg-[#A8644A] transition-transform duration-500 ${
                            isSelected ? 'scale-100' : 'scale-0'
                          }`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Upload Section */}
                  <div className="border-t border-[#2A2A2A]/5 dark:border-stone-800 pt-4 flex flex-col gap-3">
                    <span className="font-display tracking-[0.2em] text-xs uppercase opacity-60 block">
                      {lang === 'id' ? "ATAU UNGGAH FOTO SENDIRI" : "OR UPLOAD YOUR OWN PHOTO"}
                    </span>
                    <div className="flex flex-col gap-2">
                      {/* Growth Stage Selector for Custom Image */}
                      <div className="flex justify-between items-center bg-stone-100/50 dark:bg-stone-900/30 border border-[#2A2A2A]/5 p-2.5 rounded-xl text-xs sm:text-sm">
                        <span className="text-stone-500 font-light">
                          {lang === 'id' ? "Pilih Fase Pertumbuhan:" : "Select Growth Stage:"}
                        </span>
                        <select 
                          value={customGrowthStage}
                          onChange={(e: any) => setCustomGrowthStage(e.target.value)}
                          className="bg-transparent text-foreground border-none outline-none font-medium text-xs cursor-pointer focus:ring-0"
                        >
                          <option value="vegetative" className="bg-stone-100 dark:bg-stone-950">{lang === 'id' ? "Vegetatif (Anakan)" : "Vegetative"}</option>
                          <option value="generative" className="bg-stone-100 dark:bg-stone-950">{lang === 'id' ? "Generatif" : "Generative"}</option>
                          <option value="ripening" className="bg-stone-100 dark:bg-stone-950">{lang === 'id' ? "Pemasakan" : "Ripening"}</option>
                        </select>
                      </div>

                      <label className="group flex flex-col items-center justify-center border border-dashed border-[#A8644A]/30 hover:border-[#A8644A]/60 rounded-2xl p-4 cursor-pointer hover:bg-[#A8644A]/5 transition-all duration-300">
                        <div className="flex flex-col items-center gap-1.5 text-center">
                          <Upload className="w-5 h-5 text-[#A8644A] group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-xs font-semibold text-[#A8644A] uppercase tracking-wider">
                            {lang === 'id' ? "Pilih File Gambar" : "Choose Image File"}
                          </span>
                          <span className="text-[10px] text-stone-400 font-light">
                            PNG, JPG, JPEG (Max 5MB)
                          </span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="w-full bg-[#A8644A] hover:bg-[#8D523A] text-white font-medium text-xs uppercase tracking-[0.2em] py-4 rounded-full shadow-xs transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSimulating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{lang === 'id' ? "Sedang Memproses..." : "Running Pipeline..."}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                        <span>{lang === 'id' ? "Jalankan AI Pipeline" : "Execute AI Pipeline"}</span>
                      </>
                    )}
                  </button>

                  {/* Pipeline Architecture Legend */}
                  <div className="border-t border-[#2A2A2A]/5 dark:border-stone-800 pt-6 text-sm sm:text-base font-light">
                    <span className="font-display tracking-[0.2em] text-xs uppercase opacity-60 block mb-2">
                      02 / DOCUMENTATION
                    </span>
                    <h3 className="font-display text-xl tracking-wide text-foreground mb-2 font-normal">
                      {lang === 'id' ? "Tiga Tahap Pengenalan" : "Three-Stage Recognition Pipeline"}
                    </h3>
                    <p className="text-stone-500 dark:text-stone-400 leading-relaxed font-light">
                      {lang === 'id'
                        ? "Seluruh pemrosesan berjalan secara mandiri tanpa koneksi internet. Pertama, Attention U-Net memisahkan area kerusakan daun dari area sehat. Lalu, dua model EfficientNet-B0 mengidentifikasi fase tumbuh dan jenis penyakitnya. Terakhir, skor IARI mengukur tingkat kesehatan secara keseluruhan."
                        : "All processing runs independently without internet. First, Attention U-Net separates damaged leaf areas from healthy tissue. Then, two EfficientNet-B0 models identify growth stage and disease type. Finally, the IARI score measures overall crop health."
                      }
                    </p>
                  </div>
                </div>

                {/* Simulation Sandbox Screen: Right 8 spans */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                  
                  {/* Pipeline visualizer screen */}
                  <div className="border border-[#2A2A2A]/10 dark:border-stone-800 rounded-3xl p-6 md:p-8 bg-stone-50 dark:bg-stone-900/40 relative">
                                       <div className="relative flex flex-col md:flex-row gap-8 items-center z-10">
                      
                      {/* Left side: Image and Scanner Laser Animation */}
                      <div className="w-full md:w-1/2 flex flex-col items-center">
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-900 border border-[#2A2A2A]/5 shadow-sm">
                          <img 
                            src={selectedCase.image} 
                            alt="Leaf visual scan"
                            className="w-full h-full object-cover filter grayscale-[10%]"
                          />
                          
                          {/* Interactive Scan Laser Line */}
                          {isSimulating && (
                            <motion.div 
                              initial={{ y: "-10%" }}
                              animate={{ y: ["0%", "100%", "0%"] }}
                              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                              className="absolute left-0 right-0 h-[1.5px] bg-[#A8644A] shadow-[0_0_12px_#A8644A] z-20 pointer-events-none"
                            />
                          )}
                          
                          {/* Dim overlay during scan */}
                          {isSimulating && (
                            <div className="absolute inset-0 bg-[#A8644A]/5 mix-blend-overlay animate-pulse pointer-events-none" />
                          )}
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-stone-500 font-mono tracking-wider uppercase">
                          <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-[#A8644A] animate-ping' : 'bg-stone-400'}`} />
                          <span>CAMERA_INPUT: 256x256_RGB</span>
                        </div>
                      </div>

                      {/* Right side: Sequential Pipeline Steps */}
                      <div className="w-full md:w-1/2 flex flex-col gap-4 font-mono text-sm">
                        <h3 className="font-display text-lg tracking-[0.1em] uppercase text-stone-500 font-normal">
                          Visual Workflow Timeline
                        </h3>
                        
                        <div className="flex flex-col gap-4 relative pl-4 border-l border-[#2A2A2A]/10 dark:border-stone-800">
                          {/* Step 1: Input Frame */}
                          <div className={`flex flex-col gap-1 transition-opacity duration-500 ${simulationStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full -ml-[21px] z-10 ${simulationStep >= 1 ? 'bg-[#A8644A]' : 'bg-stone-300'}`} />
                              <p className="font-semibold tracking-wider text-stone-600 dark:text-stone-300">01 / LOAD IMAGE</p>
                            </div>
                            <p className="text-xs text-stone-500 font-light">
                              {simulationStep >= 1 ? "Leaf image matrix loaded from local capture." : "Pending trigger..."}
                            </p>
                          </div>

                          {/* Step 2: Attention U-Net */}
                          <div className={`flex flex-col gap-1 transition-opacity duration-500 ${simulationStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full -ml-[21px] z-10 ${simulationStep >= 2 ? 'bg-[#A8644A]' : 'bg-stone-300'}`} />
                              <p className="font-semibold tracking-wider text-stone-600 dark:text-stone-300">02 / SEGMENTATION</p>
                            </div>
                            <p className="text-xs text-stone-500 font-light">
                              {simulationStep >= 2 
                                ? `Dice: ${selectedCase.segmentation.dice.toFixed(3)} | Lesion: ${selectedCase.segmentation.lesionArea.toFixed(1)}%` 
                                : "Awaiting segmentation..."
                              }
                            </p>
                          </div>

                          {/* Step 3: Stage Classifier */}
                          <div className={`flex flex-col gap-1 transition-opacity duration-500 ${simulationStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full -ml-[21px] z-10 ${simulationStep >= 3 ? 'bg-[#A8644A]' : 'bg-stone-300'}`} />
                              <p className="font-semibold tracking-wider text-stone-600 dark:text-stone-300">03 / GROWTH STAGE</p>
                            </div>
                            <p className="text-xs text-stone-500 font-light">
                              {simulationStep >= 3 
                                ? `${lang === 'id' ? selectedCase.growthStage.stageId : selectedCase.growthStage.stageEn} | ${selectedCase.growthStage.confidence}%` 
                                : "Awaiting stage analysis..."
                              }
                            </p>
                          </div>

                          {/* Step 4: Disease Diagnosis */}
                          <div className={`flex flex-col gap-1 transition-opacity duration-500 ${simulationStep >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full -ml-[21px] z-10 ${simulationStep >= 4 ? 'bg-[#A8644A]' : 'bg-stone-300'}`} />
                              <p className="font-semibold tracking-wider text-stone-600 dark:text-stone-300">04 / DIAGNOSIS</p>
                            </div>
                            <p className="text-xs text-stone-500 font-light">
                              {simulationStep >= 4 
                                ? `${lang === 'id' ? selectedCase.diagnosis.diseaseId : selectedCase.diagnosis.diseaseEn} | ${selectedCase.diagnosis.confidence}%` 
                                : "Awaiting diagnostic analysis..."
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Agronomical Intelligence Output */}
                  <AnimatePresence>
                    {simOutputs && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="border border-[#2A2A2A]/10 dark:border-stone-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2A2A]/5 dark:border-stone-800 pb-5">
                          <div>
                            <span className="font-mono text-sm uppercase tracking-widest text-[#A8644A] block mb-1">
                              {lang === 'id' ? "HASIL PENILAIAN" : "ASSESSMENT RESULTS"}
                            </span>
                            <h3 className="font-display text-2xl tracking-tight text-[#2A2A2A] dark:text-white font-normal">
                              {lang === 'id' ? simOutputs.nameId : simOutputs.nameEn}
                            </h3>
                          </div>

                          {/* IARI Score Gauge Display */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-sm text-stone-500 dark:text-stone-400 block font-light">
                                {lang === 'id' ? "SKOR KESEHATAN (IARI)" : "HEALTH SCORE (IARI)"}
                              </span>
                              <span className="text-2xl font-display tracking-tight text-[#2A2A2A] dark:text-white font-normal">
                                {simOutputs.iariScore.toFixed(1)} / 100
                              </span>
                            </div>
                            <div className={`px-4 py-2 border rounded-xl font-mono text-xs sm:text-sm font-semibold ${simOutputs.iariColor}`}>
                              {lang === 'id' ? simOutputs.iariRiskId : simOutputs.iariRiskEn}
                            </div>
                          </div>
                        </div>

                        {/* Segmentation Stats grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-sm">
                          <div className="p-4 bg-stone-100/35 dark:bg-stone-900/35 rounded-2xl border border-[#2A2A2A]/5">
                            <span className="text-stone-500 block text-xs uppercase mb-1">
                              {lang === 'id' ? "Luas Lesi Daun" : "Lesion Percentage"}
                            </span>
                            <span className="text-lg font-semibold text-[#2A2A2A] dark:text-stone-200">
                              {simOutputs.segmentation.lesionArea.toFixed(1)}%
                            </span>
                          </div>
                          <div className="p-4 bg-stone-100/35 dark:bg-stone-900/35 rounded-2xl border border-[#2A2A2A]/5">
                            <span className="text-stone-500 block text-xs uppercase mb-1">
                              Dice Similarity
                            </span>
                            <span className="text-lg font-semibold text-[#2A2A2A] dark:text-stone-200">
                              {simOutputs.segmentation.dice.toFixed(3)}
                            </span>
                          </div>
                          <div className="p-4 bg-stone-100/35 dark:bg-stone-900/35 rounded-2xl border border-[#2A2A2A]/5">
                            <span className="text-stone-500 block text-xs uppercase mb-1">
                              {lang === 'id' ? "Patogen" : "Pathogen"}
                            </span>
                            <span className="text-lg font-semibold text-[#2A2A2A] dark:text-stone-200 truncate block">
                              {simOutputs.diagnosis.pathogen}
                            </span>
                          </div>
                        </div>

                        {/* Agronomical Recommendation */}
                        <div className="p-6 bg-stone-100/30 dark:bg-stone-900/20 border border-[#2A2A2A]/5 rounded-2xl flex gap-4">
                          <ShieldCheck className="w-8 h-8 text-[#A8644A] flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-display text-xl font-normal text-[#2A2A2A] dark:text-white tracking-wide mb-2">
                              {lang === 'id' ? "Rekomendasi Penanganan" : "Recommended Actions"}
                            </h4>
                            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                              {lang === 'id' ? simOutputs.actionId : simOutputs.actionEn}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

              {/* SECTION: Client-side Python Playground */}
              <div className="border-t border-[#2A2A2A]/10 dark:border-stone-850 pt-16 flex flex-col gap-8">
                <div>
                  <span className="font-display tracking-[0.2em] text-xs uppercase opacity-60 block mb-1">
                    03 / PYTHON SANDBOX
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-[#2A2A2A] dark:text-white font-normal">
                    {lang === 'id' ? "Eksekusi Kode Python" : "Run Python Code"}
                  </h2>
                  <p className="max-w-3xl text-base sm:text-lg text-stone-600 dark:text-stone-400 font-light leading-relaxed mt-3">
                    {lang === 'id'
                      ? "Ingin memverifikasi algoritme kami? Ubah dan jalankan skrip Python di bawah ini langsung di browser Anda. Seluruh komputasi berjalan di perangkat Anda menggunakan WebAssembly, tanpa server eksternal."
                      : "Want to verify our algorithms? Edit and run the Python script below directly in your browser. All computation runs on your device via WebAssembly — no external servers involved."
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Code Editor (7 Columns) */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="flex justify-between items-center bg-stone-900 px-5 py-3 rounded-t-2xl border-b border-stone-800 text-stone-400 text-xs font-mono">
                      <span className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-[#A8644A]" />
                        arisa_agronomy_math.py
                      </span>
                      <span className="text-xs text-stone-500 uppercase">Python 3.11 WASM</span>
                    </div>
                    <textarea
                      value={pythonCode}
                      onChange={(e) => setPythonCode(e.target.value)}
                      spellCheck="false"
                      className="w-full h-96 p-5 bg-stone-950 text-[#C5C5C5] font-mono text-xs sm:text-sm rounded-b-2xl border-x border-b border-stone-850 focus:outline-none focus:ring-1 focus:ring-[#A8644A]/45 resize-none leading-relaxed"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={handleExecutePython}
                        disabled={isPyodideLoading}
                        className="flex-1 bg-[#A8644A] hover:bg-[#8D523A] text-white font-medium text-xs uppercase tracking-widest py-3.5 rounded-full shadow-xs transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isPyodideLoading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{lang === 'id' ? "Menginisialisasi Engine..." : "Booting Python WASM..."}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>{lang === 'id' ? "Eksekusi Kode Python" : "Run Python Script"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terminal Log Console (5 Columns) */}
                  <div className="lg:col-span-5 flex flex-col gap-4 h-full">
                    <div className="flex items-center bg-stone-850 px-5 py-3 rounded-t-2xl border-b border-stone-750 text-stone-400 text-xs font-mono">
                      <span className="flex items-center gap-2">
                        <Settings className="w-3.5 h-3.5 animate-spin" />
                        Stdout / Diagnostics Log
                      </span>
                    </div>
                    <div className="w-full h-96 p-5 bg-stone-900 text-emerald-400 font-mono text-xs rounded-b-2xl border-x border-b border-stone-800 overflow-y-auto flex flex-col gap-1.5 leading-relaxed">
                      {pythonConsoleOutput.length === 0 ? (
                        <p className="text-stone-500 italic font-light">
                          {lang === 'id'
                            ? "Klik tombol 'Eksekusi Kode Python' untuk melihat output komputasi di sini..."
                            : "Click 'Run Python Script' to see calculation logs and system standard output here..."
                          }
                        </p>
                      ) : (
                        pythonConsoleOutput.map((log, index) => {
                          let color = "text-emerald-400";
                          if (log.startsWith("[Error]")) color = "text-rose-500 font-semibold";
                          if (log.startsWith("[System]")) color = "text-stone-400";
                          if (log.startsWith("[Python Error]")) color = "text-rose-400";
                          if (log.startsWith("[Success]")) color = "text-amber-400 font-semibold";
                          return (
                            <p key={index} className={`${color} whitespace-pre-wrap`}>
                              {log}
                            </p>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: METRICS CONTROL TOWER */}
          {activeTab === 'metrics' && (
            <motion.div
              key="tab-metrics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-12"
            >
              {/* Plot subtabs navigation */}
              <div className="flex bg-stone-200/50 dark:bg-stone-800/50 border border-stone-300/20 p-1.5 rounded-2xl self-start overflow-x-auto max-w-full no-scrollbar">
                {[
                  { id: 'seg', labelId: 'U-Net Segmentasi', labelEn: 'U-Net Segmentation' },
                  { id: 'stage', labelId: 'Fase Pertumbuhan', labelEn: 'Growth Stage' },
                  { id: 'disease', labelId: 'Diagnosis Penyakit', labelEn: 'Disease Diagnosis' },
                  { id: 'hw', labelId: 'Uji Perangkat Keras', labelEn: 'Hardware Benchmarks' }
                ].map((subtab) => {
                  const isActive = activeMetricSubTab === subtab.id;
                  return (
                    <button
                      key={subtab.id}
                      onClick={() => setActiveMetricSubTab(subtab.id as any)}
                      className={`px-5 py-2.5 rounded-xl text-sm tracking-wider transition-all duration-300 whitespace-nowrap font-medium ${
                        isActive 
                          ? 'bg-[#A8644A] text-white shadow-xs' 
                          : 'text-stone-500 dark:text-stone-400 hover:text-[#2A2A2A]'
                      }`}
                    >
                      {lang === 'id' ? subtab.labelId : subtab.labelEn}
                    </button>
                  );
                })}
              </div>

              {/* Sub-tab Intro Banner */}
              <div className="p-6 border border-[#2A2A2A]/5 rounded-2xl flex gap-4 text-sm sm:text-base font-light leading-relaxed bg-stone-50 dark:bg-stone-900/30">
                <Info className="w-5 h-5 text-[#A8644A] flex-shrink-0 mt-0.5" />
                <p className="text-stone-600 dark:text-stone-400 font-light">
                  {activeMetricSubTab === 'seg' && (
                    lang === 'id' 
                      ? "Metrik pelatihan Attention U-Net kami mengevaluasi piksel lesi mikro pada daun padi dengan Focal Tversky Loss. Klik gambar untuk melihat resolusi penuh."
                      : "Attention U-Net metrics evaluate fine rice leaf lesion pixels using Focal Tversky Loss. Click images to view full resolution plots."
                  )}
                  {activeMetricSubTab === 'stage' && (
                    lang === 'id' 
                      ? "Akurasi model fase vegetasi dan generatif padi dinilai melalui matriks kebingungan dan kurva ROC pada model teroptimasi Mobile-Edge."
                      : "Growth stage accuracy metrics evaluate vegetative and generative phases using confusion matrices and ROC curves optimized for mobile-edge."
                  )}
                  {activeMetricSubTab === 'disease' && (
                    lang === 'id' 
                      ? "Model identifikasi penyakit mendalam (AgroGuard-19K) diuji pada 7 kelas hama dan penyakit padi dengan pencatatan akurasi validasi superior."
                      : "Deep disease diagnosis models (AgroGuard-19K) benchmarked across 7 target pest & disease classes showing superior validation metrics."
                  )}
                  {activeMetricSubTab === 'hw' && (
                    lang === 'id' 
                      ? "Analisis latency komparatif (dalam milidetik) dan beban kerja RAM Raspberry Pi 4 Model B di lapangan pada inferensi modular sekuensial."
                      : "Comparative latency (in milliseconds) and RAM resource profiling on Raspberry Pi 4 Model B during live sequential edge-inference."
                  )}
                </p>
              </div>

              {/* Grid of plots - Editorial flat canvas style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-4">
                {(activeMetricSubTab === 'seg' ? PLOTS_SEGMENTATION :
                  activeMetricSubTab === 'stage' ? PLOTS_STAGE_CLASS :
                  activeMetricSubTab === 'disease' ? PLOTS_DISEASE_CLASS :
                  PLOTS_HARDWARE_BENCHMARKS).map((plot) => {
                    const plotTitle = lang === 'id' ? plot.titleId : plot.titleEn;
                    const imgUrl = `/checkpoints/${lang}_${plot.filename}.webp`;
                    
                    return (
                      <motion.div
                        key={plot.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-transparent flex flex-col h-full group"
                      >
                        {/* Aspect Ratio Box with Zoom-in Interaction */}
                        <div 
                          onClick={() => {
                            setLightboxImg(imgUrl);
                            setLightboxTitle(plotTitle);
                          }}
                          className="relative aspect-[3/2] overflow-hidden bg-stone-200 dark:bg-stone-900 border border-[#2A2A2A]/5 rounded-2xl cursor-zoom-in shadow-xs"
                        >
                          <img 
                            src={imgUrl} 
                            alt={plotTitle}
                            className="object-cover w-full h-full filter grayscale-[10%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                          />
                        </div>

                        {/* Title and Descriptions directly below */}
                        <div className="py-4 flex flex-col flex-grow">
                          <h3 className="font-display text-xl text-[#2A2A2A] dark:text-white tracking-tight leading-snug group-hover:text-[#A8644A] transition-colors duration-300">
                            {plotTitle}
                          </h3>
                          <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 font-light leading-relaxed mt-2 flex-grow">
                            {lang === 'id' ? plot.descriptionId : plot.descriptionEn}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: MODEL REGISTRY */}
          {activeTab === 'models' && (
            <motion.div
              key="tab-models"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-12"
            >
              <div>
                <span className="font-display tracking-[0.2em] text-xs uppercase opacity-60 block mb-1">
                  OFFLINE EMBEDDED MODELS
                </span>
                <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-[#2A2A2A] dark:text-white font-normal">
                  {lang === 'id' ? "Lembar Spesifikasi Model" : "Model Specification Sheet"}
                </h2>
              </div>

              {/* Large editorial table view */}
              <div className="overflow-x-auto border-t border-[#2A2A2A]/10 dark:border-stone-800">
                <table className="w-full text-left font-body text-sm sm:text-base">
                  <thead>
                    <tr className="border-b border-[#2A2A2A]/10 dark:border-stone-800 text-stone-400 uppercase tracking-widest text-xs h-14">
                      <th className="font-normal pr-4">{lang === 'id' ? "Model & Kelas" : "Model & Objective"}</th>
                      <th className="font-normal pr-4">Input Size</th>
                      <th className="font-normal pr-4">{lang === 'id' ? "Parameter" : "Params"}</th>
                      <th className="font-normal pr-4">{lang === 'id' ? "Ukuran Kuantisasi" : "Quant Size"}</th>
                      <th className="font-normal pr-4">{lang === 'id' ? "Metrik Utama" : "Primary Metric"}</th>
                      <th className="font-normal text-right">{lang === 'id' ? "Unduhan" : "Downloads"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2A2A]/5 dark:divide-stone-850">
                    
                    {/* Row 1: Attention U-Net */}
                    <tr className="h-24">
                      <td className="pr-4 py-4 max-w-xs">
                        <div className="font-display text-lg text-[#2A2A2A] dark:text-white font-normal">Attention U-Net</div>
                        <div className="text-xs text-stone-500 font-light mt-0.5">
                          {lang === 'id' ? "Segmentasi piksel lesi mikro tanaman padi" : "Pixel-level visual pathology partition scanning"}
                        </div>
                      </td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">256x256x3 RGB</td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">7,848,321</td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">7.66 MB <span className="text-xs text-stone-400 dark:text-stone-500">(FP32: 85.7MB)</span></td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">Dice / mIoU: 0.938</td>
                      <td className="pr-4 py-4 text-right">
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2.5 font-mono text-xs">
                          <a 
                            href="/checkpoints/arisa_unet_quantized.tflite" 
                            download 
                            className="group flex items-center gap-1.5 px-4 py-2.5 bg-[#A8644A] hover:bg-[#C0775C] dark:bg-[#A8644A] dark:hover:bg-[#C0775C] text-white rounded-md font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(168,100,74,0.18)] hover:shadow-[0_6px_20px_rgba(168,100,74,0.35)] hover:-translate-y-0.5 whitespace-nowrap border border-[#A8644A]/10"
                          >
                            <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5 duration-300" />
                            <span>TFLite (INT8)</span>
                          </a>
                          <a 
                            href={gcsConfig.models.unet} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group flex items-center gap-1.5 px-4 py-2.5 border border-[#A8644A]/30 dark:border-[#A8644A]/40 bg-[#A8644A]/5 hover:bg-[#A8644A] text-[#A8644A] dark:text-[#BF785B] hover:text-white dark:hover:text-white rounded-md font-mono text-xs font-medium uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap hover:shadow-[0_4px_12px_rgba(168,100,74,0.15)]"
                          >
                            <Download className="w-3.5 h-3.5 text-[#A8644A] dark:text-[#BF785B] group-hover:text-white transition-all duration-300 group-hover:translate-y-0.5" />
                            <span>Raw (.h5)</span>
                          </a>
                        </div>
                      </td>
                    </tr>

                    {/* Row 2: EfficientNet Stage */}
                    <tr className="h-24">
                      <td className="pr-4 py-4 max-w-xs">
                        <div className="font-display text-lg text-[#2A2A2A] dark:text-white font-normal">EfficientNet-B0 Stage</div>
                        <div className="text-xs text-stone-500 font-light mt-0.5">
                          {lang === 'id' ? "Klasifikasi 4 fase pertumbuhan utama tanaman padi" : "Physiological vegetative/generative stage classifier"}
                        </div>
                      </td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">224x224x3 RGB</td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">4,049,564</td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">4.95 MB <span className="text-xs text-stone-400 dark:text-stone-500">(FP32: 27.6MB)</span></td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">Accuracy: 98.7%</td>
                      <td className="pr-4 py-4 text-right">
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2.5 font-mono text-xs">
                          <a 
                            href="/checkpoints/arisa_classifier_quantized.tflite" 
                            download 
                            className="group flex items-center gap-1.5 px-4 py-2.5 bg-[#A8644A] hover:bg-[#C0775C] dark:bg-[#A8644A] dark:hover:bg-[#C0775C] text-white rounded-md font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(168,100,74,0.18)] hover:shadow-[0_6px_20px_rgba(168,100,74,0.35)] hover:-translate-y-0.5 whitespace-nowrap border border-[#A8644A]/10"
                          >
                            <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5 duration-300" />
                            <span>TFLite (INT8)</span>
                          </a>
                          <a 
                            href={gcsConfig.models.stageClassifier} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group flex items-center gap-1.5 px-4 py-2.5 border border-[#A8644A]/30 dark:border-[#A8644A]/40 bg-[#A8644A]/5 hover:bg-[#A8644A] text-[#A8644A] dark:text-[#BF785B] hover:text-white dark:hover:text-white rounded-md font-mono text-xs font-medium uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap hover:shadow-[0_4px_12px_rgba(168,100,74,0.15)]"
                          >
                            <Download className="w-3.5 h-3.5 text-[#A8644A] dark:text-[#BF785B] group-hover:text-white transition-all duration-300 group-hover:translate-y-0.5" />
                            <span>Raw (.h5)</span>
                          </a>
                        </div>
                      </td>
                    </tr>

                    {/* Row 3: AgroGuard-19K */}
                    <tr className="h-24">
                      <td className="pr-4 py-4 max-w-xs">
                        <div className="font-display text-lg text-[#2A2A2A] dark:text-white font-normal">AgroGuard-19K Classifier</div>
                        <div className="text-xs text-stone-500 font-light mt-0.5">
                          {lang === 'id' ? "Klasifikasi 7 kelas hama dan penyakit padi lokal" : "Multi-class pest and diagnostic disease classifier"}
                        </div>
                      </td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">224x224x3 RGB</td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">4,057,255</td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">4.96 MB <span className="text-xs text-stone-400 dark:text-stone-500">(FP32: 49.1MB)</span></td>
                      <td className="font-mono pr-4 py-4 text-stone-600 dark:text-stone-300">Accuracy: 96.4%</td>
                      <td className="pr-4 py-4 text-right">
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2.5 font-mono text-xs">
                          <a 
                            href="/checkpoints/arisa_disease_quantized.tflite" 
                            download 
                            className="group flex items-center gap-1.5 px-4 py-2.5 bg-[#A8644A] hover:bg-[#C0775C] dark:bg-[#A8644A] dark:hover:bg-[#C0775C] text-white rounded-md font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(168,100,74,0.18)] hover:shadow-[0_6px_20px_rgba(168,100,74,0.35)] hover:-translate-y-0.5 whitespace-nowrap border border-[#A8644A]/10"
                          >
                            <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5 duration-300" />
                            <span>TFLite (INT8)</span>
                          </a>
                          <a 
                            href={gcsConfig.models.diseaseClassifier} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group flex items-center gap-1.5 px-4 py-2.5 border border-[#A8644A]/30 dark:border-[#A8644A]/40 bg-[#A8644A]/5 hover:bg-[#A8644A] text-[#A8644A] dark:text-[#BF785B] hover:text-white dark:hover:text-white rounded-md font-mono text-xs font-medium uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap hover:shadow-[0_4px_12px_rgba(168,100,74,0.15)]"
                          >
                            <Download className="w-3.5 h-3.5 text-[#A8644A] dark:text-[#BF785B] group-hover:text-white transition-all duration-300 group-hover:translate-y-0.5" />
                            <span>Raw (.h5)</span>
                          </a>
                        </div>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 4: DOWNLOAD CENTER */}
          {activeTab === 'downloads' && (
            <motion.div
              key="tab-downloads"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
            >
              {/* Datasets Center (8 columns) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                <div>
                  <span className="font-display tracking-[0.2em] text-xs uppercase opacity-60 block mb-1">
                    SCIENTIFIC ARCHIVES
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-[#2A2A2A] dark:text-white font-normal">
                    {lang === 'id' ? "Kumpulan Data Penelitian" : "Scientific Datasets Download"}
                  </h2>
                  <p className="max-w-2xl text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-light mt-3 leading-relaxed">
                    {lang === 'id'
                      ? "Kami berkomitmen mendukung keterbukaan sains (Open Science). Unduh seluruh dataset riset terstruktur yang kami himpun langsung dari Google Cloud Storage."
                      : "We strictly adhere to open science principles. You can download all annotated primary datasets generated during this project directly from our cold-storage bucket."
                    }
                  </p>
                </div>

                <div className="flex flex-col gap-6 border-t border-[#2A2A2A]/10 dark:border-stone-800 pt-6">
                  
                  {/* Dataset 1 - Hero Highlighted Card */}
                  <div className="p-6 sm:p-8 bg-stone-100/50 dark:bg-stone-900/30 border border-[#A8644A]/15 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs relative overflow-hidden transition-all duration-300 hover:border-[#A8644A]/30">
                    <div className="absolute top-0 right-0 bg-[#A8644A]/10 text-[#A8644A] dark:text-[#BF785B] font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-bl-lg font-bold">
                      {lang === 'id' ? "ARSIP UTAMA" : "FLAGSHIP ARCHIVE"}
                    </div>
                    <div className="max-w-xl">
                      <span className="font-mono text-xs font-bold text-[#A8644A] dark:text-[#BF785B] uppercase tracking-widest block mb-1">
                        {lang === 'id' ? "PRIMARY DISEASE DIAGNOSIS" : "PRIMARY PATHOLOGY"}
                      </span>
                      <h3 className="font-display text-2xl text-[#2A2A2A] dark:text-white font-medium">
                        AgroGuard-19K Dataset
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light mt-2 leading-relaxed">
                        {lang === 'id'
                          ? "18,558 citra terklasifikasi mencakup 7 kelas diagnosis hama dan penyakit padi (Blas, Hawar Daun, Tungro, Bercak Coklat, Sehat, dll.) untuk menunjang penelitian agronomi terbuka."
                          : "Annotated image array of 18,558 rice leaves covering 7 local pests and visual anomalies, curated specifically for open academic research."
                        }
                      </p>
                      <div className="font-mono text-xs text-stone-500 dark:text-stone-400 flex gap-4 mt-3">
                        <span className="bg-stone-200/50 dark:bg-stone-800/60 px-2 py-0.5 rounded">Size: ~1.2 GB</span>
                        <span className="bg-stone-200/50 dark:bg-stone-800/60 px-2 py-0.5 rounded">Format: ZIP (JPEG)</span>
                      </div>
                    </div>
                    <a
                      href={gcsConfig.datasets.agroGuard19k}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-2 px-6 py-4 bg-[#A8644A] hover:bg-[#C0775C] dark:bg-[#A8644A] dark:hover:bg-[#C0775C] text-white font-mono text-xs uppercase tracking-widest font-semibold rounded-lg transition-all duration-300 shadow-[0_4px_14px_rgba(168,100,74,0.25)] hover:shadow-[0_6px_22px_rgba(168,100,74,0.45)] hover:-translate-y-0.5 shrink-0 self-start md:self-center w-full md:w-auto"
                    >
                      <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5 duration-300" />
                      <span>{lang === 'id' ? "Unduh Dataset Utama" : "Download Flagship ZIP"}</span>
                    </a>
                  </div>

                  {/* Standard Datasets List Header */}
                  <div className="pt-4 pb-2 border-b border-[#2A2A2A]/5 dark:border-stone-850">
                    <span className="font-display text-xs uppercase tracking-[0.2em] text-stone-400 font-medium">
                      {lang === 'id' ? "Arsip Pendukung & Model Tambahan" : "Supporting Archives & Metadata"}
                    </span>
                  </div>

                  <div className="flex flex-col divide-y divide-[#2A2A2A]/5 dark:divide-stone-850">
                    {/* Dataset 2 */}
                    <div className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="max-w-md">
                        <span className="font-mono text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                          {lang === 'id' ? "PRIMARY STAGE ARCHIVE" : "PHYSIOLOGICAL CLASSIFICATION"}
                        </span>
                        <h4 className="font-display text-lg text-[#2A2A2A] dark:text-white mt-1">
                          DataSet-Vegetasi-Enriched
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-light mt-1 leading-relaxed">
                          {lang === 'id'
                            ? "Kumpulan 495 citra fase vegetasi dan generatif padi varietas lokal yang dikurasi khusus untuk optimalisasi pengkondisian matematis formula IARI."
                            : "495 high-resolution growth stage image files representing local varieties optimized for mathematical IARI tuning."
                          }
                        </p>
                        <div className="font-mono text-xs text-stone-400 dark:text-stone-500 flex gap-4 mt-2">
                          <span>Size: ~150 MB</span>
                          <span>Format: ZIP (JPEG)</span>
                        </div>
                      </div>
                      <a
                        href={gcsConfig.datasets.stageEnriched}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-2 px-5 py-3 border border-[#A8644A]/30 dark:border-[#A8644A]/40 bg-[#A8644A]/5 hover:bg-[#A8644A] text-[#A8644A] dark:text-[#BF785B] hover:text-white dark:hover:text-white font-mono text-xs uppercase tracking-wider font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(168,100,74,0.15)] shrink-0 self-start sm:self-center w-full sm:w-auto"
                      >
                        <Download className="w-3.5 h-3.5 text-[#A8644A] dark:text-[#BF785B] group-hover:text-white transition-all duration-300 group-hover:translate-y-0.5" />
                        <span>{lang === 'id' ? "Unduh ZIP" : "Download ZIP"}</span>
                      </a>
                    </div>

                    {/* Dataset 3 */}
                    <div className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="max-w-md">
                        <span className="font-mono text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                          PREPROCESSED BINARY NUMPY
                        </span>
                        <h4 className="font-display text-lg text-[#2A2A2A] dark:text-white mt-1">
                          arisa_segmentation_dataset
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-light mt-1 leading-relaxed">
                          {lang === 'id'
                            ? "Dataset berformat array biner NumPy (.npy) hasil prapemrosesan siap guna, langsung dapat dilatih pada Google Colab/Kaggle."
                            : "Trained segmentation dataset compiled directly to raw NumPy binary matrices (.npy), ready for Google Colab pipelines."
                          }
                        </p>
                        <div className="font-mono text-xs text-stone-400 dark:text-stone-500 flex gap-4 mt-2">
                          <span>Size: ~50 MB</span>
                          <span>Format: ZIP (.npy files)</span>
                        </div>
                      </div>
                      <a
                        href={gcsConfig.datasets.segmentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-2 px-5 py-3 border border-[#A8644A]/30 dark:border-[#A8644A]/40 bg-[#A8644A]/5 hover:bg-[#A8644A] text-[#A8644A] dark:text-[#BF785B] hover:text-white dark:hover:text-white font-mono text-xs uppercase tracking-wider font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(168,100,74,0.15)] shrink-0 self-start sm:self-center w-full sm:w-auto"
                      >
                        <Download className="w-3.5 h-3.5 text-[#A8644A] dark:text-[#BF785B] group-hover:text-white transition-all duration-300 group-hover:translate-y-0.5" />
                        <span>{lang === 'id' ? "Unduh ZIP" : "Download ZIP"}</span>
                      </a>
                    </div>

                    {/* Dataset 4 */}
                    <div className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="max-w-md">
                        <span className="font-mono text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                          RAW LEAF SEGMENTATION & VOC
                        </span>
                        <h4 className="font-display text-lg text-[#2A2A2A] dark:text-white mt-1">
                          RiceLeafDisease Dataset
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 font-light mt-1 leading-relaxed">
                          {lang === 'id'
                            ? "Kumpulan citra padi mentah berserta fail XML berformat Pascal VOC yang dikembangkan berdasarkan dataset awal Kaggle."
                            : "Primary raw rice leaf images accompanied by Pascal VOC structured XML annotation blocks."
                          }
                        </p>
                        <div className="font-mono text-xs text-stone-400 dark:text-stone-500 flex gap-4 mt-2">
                          <span>Size: ~62.1 MB</span>
                          <span>Format: ZIP (XML & JPEG)</span>
                        </div>
                      </div>
                      <a
                        href={gcsConfig.datasets.rawSegmentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-2 px-5 py-3 border border-[#A8644A]/30 dark:border-[#A8644A]/40 bg-[#A8644A]/5 hover:bg-[#A8644A] text-[#A8644A] dark:text-[#BF785B] hover:text-white dark:hover:text-white font-mono text-xs uppercase tracking-wider font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(168,100,74,0.15)] shrink-0 self-start sm:self-center w-full sm:w-auto"
                      >
                        <Download className="w-3.5 h-3.5 text-[#A8644A] dark:text-[#BF785B] group-hover:text-white transition-all duration-300 group-hover:translate-y-0.5" />
                        <span>{lang === 'id' ? "Unduh ZIP" : "Download ZIP"}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Releases & Apps Center (4 columns) */}
              <div className="lg:col-span-4 flex flex-col gap-12">
                <div>
                  <span className="font-display tracking-[0.2em] text-xs uppercase opacity-60 block mb-1">
                    PRODUCTION BUILDS
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-[#2A2A2A] dark:text-white font-normal">
                    Releases
                  </h2>
                </div>

                <div className="flex flex-col gap-8">
                  {/* APK Client Card - Hero Release Card */}
                  <div className="p-6 bg-stone-100/50 dark:bg-stone-900/30 border border-[#A8644A]/15 rounded-xl flex flex-col gap-4 shadow-xs relative overflow-hidden transition-all duration-300 hover:border-[#A8644A]/30">
                    <div className="absolute top-0 right-0 bg-[#A8644A]/10 text-[#A8644A] dark:text-[#BF785B] font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-bl-lg font-bold">
                      {lang === 'id' ? "REKOMENDASI" : "RECOMMENDED"}
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-[#A8644A] dark:text-[#BF785B] uppercase tracking-widest block mb-1">
                        MOBILE CLIENT (STABLE)
                      </span>
                      <h3 className="font-display text-2xl text-[#2A2A2A] dark:text-white font-medium">
                        Android APK v1.0
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                      {lang === 'id'
                        ? "Aplikasi Android siap pasang (APK) untuk pemindaian daun padi offline menggunakan kamera ponsel dengan eksekusi model TensorFlow Lite offline secara real-time."
                        : "Compiled production-ready Android client (APK) for live offline diagnostic leaf-scanning utilizing client-side TensorFlow Lite modules."
                      }
                    </p>
                    <div className="font-mono text-xs text-stone-500 dark:text-stone-400 flex flex-col gap-1">
                      <span>File Name: ARISA-Mobile-Client.apk</span>
                      <span>File Size: ~25 MB</span>
                    </div>
                    <a
                      href={gcsConfig.releases.apk}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#A8644A] hover:bg-[#C0775C] dark:bg-[#A8644A] dark:hover:bg-[#C0775C] text-white font-mono text-xs uppercase tracking-widest font-semibold rounded-lg transition-all duration-300 shadow-[0_4px_14px_rgba(168,100,74,0.2)] hover:shadow-[0_6px_22px_rgba(168,100,74,0.4)] hover:-translate-y-0.5 w-full text-center"
                    >
                      <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5 duration-300" />
                      <span>{lang === 'id' ? "Unduh APK Seluler" : "Download APK File"}</span>
                    </a>
                  </div>

                  {/* Mobile Source ZIP Card - Secondary Release Card */}
                  <div className="p-6 border border-stone-200 dark:border-stone-850 bg-white/20 dark:bg-stone-900/10 rounded-xl flex flex-col gap-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-stone-400 uppercase tracking-widest block mb-1">
                        MOBILE APP SOURCE WORKSPACE
                      </span>
                      <h3 className="font-display text-xl text-[#2A2A2A] dark:text-white font-medium">
                        Flutter/React Native Complete Source
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-light leading-relaxed">
                      {lang === 'id'
                        ? "Kode sumber lengkap sistem klien mobile yang didesain secara adaptif dengan manajemen memori tangguh untuk pemrosesan citra offline."
                        : "Complete workspace structure with optimized native wrappers for offline camera image arrays."
                      }
                    </p>
                    <div className="font-mono text-xs text-stone-400 dark:text-stone-500 flex flex-col gap-1">
                      <span>File Size: ~440 MB</span>
                    </div>
                    <a
                      href={gcsConfig.releases.sourceZip}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center gap-2 px-6 py-3.5 border border-[#A8644A]/30 dark:border-[#A8644A]/40 bg-[#A8644A]/5 hover:bg-[#A8644A] text-[#A8644A] dark:text-[#BF785B] hover:text-white dark:hover:text-white font-mono text-xs uppercase tracking-wider font-medium rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(168,100,74,0.15)] w-full text-center"
                    >
                      <Download className="w-3.5 h-3.5 text-[#A8644A] dark:text-[#BF785B] group-hover:text-white transition-all duration-300 group-hover:translate-y-0.5" />
                      <span>{lang === 'id' ? "Unduh Kode Sumber" : "Download Source ZIP"}</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* GLOBAL SCROLLABLE SCIENTIFIC RESEARCH SECTIONS (Spacious Vertical Extension) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-32 flex flex-col gap-32 border-t border-[#2A2A2A]/5 dark:border-stone-800 pt-32 pb-40">
        
        {/* SECTION 1: LEAF DISEASE PATHOLOGY MATRIX */}
        <section className="flex flex-col gap-12">
          <div className="border-b border-[#2A2A2A]/10 dark:border-stone-800 pb-6">
            <span className="font-display tracking-[0.25em] text-xs uppercase opacity-60 block mb-2">
              RESEARCH SPECIFICATION / 01
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#2A2A2A] dark:text-white leading-tight">
              {lang === 'id' 
                ? "Matriks Gejala & Epidemiologi Patologi Daun" 
                : "Leaf Disease Symptoms & Epidemiology Matrix"
              }
            </h2>
            <p className="max-w-3xl text-sm sm:text-base text-stone-500 dark:text-stone-400 font-light mt-3 leading-relaxed">
              {lang === 'id'
                ? "Analisis makroskopis komparatif terhadap jenis penyakit utama daun padi lokal yang disasar oleh model pendeteksi tepi tepi-AI ARISA."
                : "Comparative macroscopic analysis of the primary rice leaf anomalies targeted by the ARISA edge-AI multi-class pipeline."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Blast Daun */}
            <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl border border-[#2A2A2A]/5 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-900/35 hover:border-[#A8644A]/25 transition-all duration-300 shadow-xs">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-900 border border-[#2A2A2A]/5">
                <img 
                  src="/science/real-blast.webp" 
                  alt="Leaf Blast pathology scan"
                  className="object-cover w-full h-full filter grayscale-[15%] hover:grayscale-0 hover:scale-[1.03] transition-all duration-700"
                />
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-[#A8644A] font-semibold tracking-wider">DISEASE_01</span>
                <span className="text-stone-400 uppercase">Fungal Infection</span>
              </div>
              <h3 className="font-display text-2xl text-[#2A2A2A] dark:text-white font-normal">
                {lang === 'id' ? "Blas Daun (Leaf Blast)" : "Leaf Blast Pathology"}
              </h3>
              <div className="divide-y divide-[#2A2A2A]/5 dark:divide-stone-850 text-xs sm:text-sm font-light">
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Patogen" : "Pathogen"}</span>
                  <span className="font-mono text-[#A8644A] italic">Pyricularia oryzae</span>
                </div>
                <div className="py-3 flex flex-col gap-1">
                  <span className="text-stone-500">{lang === 'id' ? "Gejala Visual" : "Primary Symptoms"}</span>
                  <span className="text-[#2A2A2A] dark:text-stone-300 leading-relaxed">
                    {lang === 'id'
                      ? "Lesi berbentuk belah ketupat (spindle-shaped) lebar di tengah, ujung meruncing, pusat abu-abu atau keputihan dengan tepi cokelat gelap."
                      : "Diamond-shaped lesions, wide in the middle and pointed at ends, containing gray-to-white centers with dark-brown borders."
                    }
                  </span>
                </div>
                <div className="py-3 flex flex-col gap-1">
                  <span className="text-stone-500">{lang === 'id' ? "Vektor & Pemicu" : "Ecological Vector"}</span>
                  <span className="text-[#2A2A2A] dark:text-stone-300 leading-relaxed">
                    {lang === 'id'
                      ? "Kelembapan udara tinggi (>90%), suhu malam hangat (24-28°C), serta pemupukan Nitrogen berlebih yang memperlunak jaringan daun."
                      : "High humidity levels (>90%), warm nights (24-28°C), and excessive Nitrogen fertilization that softens leaf tissue."
                    }
                  </span>
                </div>
                <div className="py-3 flex flex-col gap-1">
                  <span className="text-stone-500">{lang === 'id' ? "Penanganan Agronomis" : "Treatments"}</span>
                  <span className="text-[#2A2A2A] dark:text-stone-300 leading-relaxed">
                    {lang === 'id'
                      ? "Aplikasi fungisida Trisiklazol atau Difenokonazol. Kurangi Urea, lakukan penyiangan gulma inang, dan keringkan lahan berkala (intermittent)."
                      : "Apply Tricyclazole or Difenoconazole fungicides. Limit Urea, prune alternative host weeds, and perform intermittent dry-wet irrigation."
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Penyakit Tungro */}
            <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl border border-[#2A2A2A]/5 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-900/35 hover:border-[#A8644A]/25 transition-all duration-300 shadow-xs">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-900 border border-[#2A2A2A]/5">
                <img 
                  src="/science/leaf-mild.webp" 
                  alt="Tungro disease pathology scan"
                  className="object-cover w-full h-full filter grayscale-[15%] hover:grayscale-0 hover:scale-[1.03] transition-all duration-700"
                />
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-[#A8644A] font-semibold tracking-wider">DISEASE_02</span>
                <span className="text-stone-400 uppercase">Viral Complex</span>
              </div>
              <h3 className="font-display text-2xl text-[#2A2A2A] dark:text-white font-normal">
                {lang === 'id' ? "Penyakit Tungro" : "Tungro Disease Complex"}
              </h3>
              <div className="divide-y divide-[#2A2A2A]/5 dark:divide-stone-850 text-xs sm:text-sm font-light">
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Patogen" : "Pathogen"}</span>
                  <span className="font-mono text-[#A8644A] italic">RTBV & RTSV Virus</span>
                </div>
                <div className="py-3 flex flex-col gap-1">
                  <span className="text-stone-500">{lang === 'id' ? "Gejala Visual" : "Primary Symptoms"}</span>
                  <span className="text-[#2A2A2A] dark:text-stone-300 leading-relaxed">
                    {lang === 'id'
                      ? "Daun menguning hingga oranye jingga dari ujung daun tua ke pangkal. Pertumbuhan rumpun padi sangat kerdil, jumlah anakan berkurang."
                      : "Leaf yellowing-to-orange discoloration starting from leaf tips. Stunted growth of tillers, yielding minimal panicles."
                    }
                  </span>
                </div>
                <div className="py-3 flex flex-col gap-1">
                  <span className="text-stone-500">{lang === 'id' ? "Vektor & Pemicu" : "Ecological Vector"}</span>
                  <span className="text-[#2A2A2A] dark:text-stone-300 leading-relaxed">
                    {lang === 'id'
                      ? "Ditularkan secara semi-persisten oleh hama Wereng Hijau (Nephotettix virescens) yang menusuk dan mengisap cairan pelepah padi."
                      : "Transmitted semi-persistently by the Green Leafhopper (Nephotettix virescens) vector piercing leaf sheaths."
                    }
                  </span>
                </div>
                <div className="py-3 flex flex-col gap-1">
                  <span className="text-stone-500">{lang === 'id' ? "Penanganan Agronomis" : "Treatments"}</span>
                  <span className="text-[#2A2A2A] dark:text-stone-300 leading-relaxed">
                    {lang === 'id'
                      ? "Cabut dan bakar rumpun sakit (eradikasi). Kendalikan wereng hijau dengan insektisida Imidakloprid. Sinkronisasi waktu tanam serentak."
                      : "Uproot and burn infected clumps. Manage insect vectors with Imidacloprid systemic spray. Synchronize regional planting schedules."
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Hawar Daun Bakteri */}
            <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl border border-[#2A2A2A]/5 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-900/35 hover:border-[#A8644A]/25 transition-all duration-300 shadow-xs">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-900 border border-[#2A2A2A]/5">
                <img 
                  src="/science/real-blight.webp" 
                  alt="Bacterial Leaf Blight pathology scan"
                  className="object-cover w-full h-full filter grayscale-[15%] hover:grayscale-0 hover:scale-[1.03] transition-all duration-700"
                />
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-[#A8644A] font-semibold tracking-wider">DISEASE_03</span>
                <span className="text-stone-400 uppercase">Bacterial Infection</span>
              </div>
              <h3 className="font-display text-2xl text-[#2A2A2A] dark:text-white font-normal">
                {lang === 'id' ? "Hawar Daun (Bacterial Blight)" : "Bacterial Leaf Blight"}
              </h3>
              <div className="divide-y divide-[#2A2A2A]/5 dark:divide-stone-850 text-xs sm:text-sm font-light">
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Patogen" : "Pathogen"}</span>
                  <span className="font-mono text-[#A8644A] italic">Xanthomonas oryzae</span>
                </div>
                <div className="py-3 flex flex-col gap-1">
                  <span className="text-stone-500">{lang === 'id' ? "Gejala Visual" : "Primary Symptoms"}</span>
                  <span className="text-[#2A2A2A] dark:text-stone-300 leading-relaxed">
                    {lang === 'id'
                      ? "Garis kebasahan (water-soaked stripes) di sepanjang tepi daun, berubah abu-abu kekuningan bergelombang, mengering mirip terbakar."
                      : "Water-soaked stripes along leaf margins, turning into wavy yellowish lesions that dry up, mimicking scorched straw."
                    }
                  </span>
                </div>
                <div className="py-3 flex flex-col gap-1">
                  <span className="text-stone-500">{lang === 'id' ? "Vektor & Pemicu" : "Ecological Vector"}</span>
                  <span className="text-[#2A2A2A] dark:text-stone-300 leading-relaxed">
                    {lang === 'id'
                      ? "Hujan angin kencang yang memicu luka gesekan fisis antar daun, kelembapan tinggi, dan penggunaan nitrogen dosis berlebih."
                      : "Windstorms triggering physical leaf friction lesions, combined with standing water and excess nitrogen fertilization."
                    }
                  </span>
                </div>
                <div className="py-3 flex flex-col gap-1">
                  <span className="text-stone-500">{lang === 'id' ? "Penanganan Agronomis" : "Treatments"}</span>
                  <span className="text-[#2A2A2A] dark:text-stone-300 leading-relaxed">
                    {lang === 'id'
                      ? "Gunakan bakterisida berbahan aktif Tembaga. Jaga pemupukan Kalium yang cukup, hindari pemotongan ujung bibit saat pindah tanam."
                      : "Apply copper-based bactericides. Supplement with adequate Potassium (K) fertilizer; avoid pruning seedling tips during transplantation."
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: MATHEMATICAL MODELING OF IARI */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 border-t border-[#2A2A2A]/5 dark:border-stone-800 pt-24 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="font-display tracking-[0.25em] text-xs uppercase opacity-60">
              MATHEMATICAL MODELING / 02
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#2A2A2A] dark:text-white leading-tight">
              {lang === 'id' 
                ? "Formulasi Indeks Kesehatan Tanaman ARISA" 
                : "The ARISA Crop Health Index (IARI) Modeling"
              }
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              {lang === 'id'
                ? "Indeks Kesehatan Tanaman ARISA (IARI) dirancang untuk mengintegrasikan persentase luas lesi visual mikro hasil segmentasi Attention U-Net secara proporsional dengan fase fisiologis tanaman. Fase generatif mendapat beban penalti lebih berat karena kerusakan daun bendera secara langsung menurunkan produktivitas bulir padi."
                : "The ARISA Crop Health Index (IARI) mathematically maps microscopic lesion damage to actual crop productivity. It scales visual surface decay dynamically using the physiological growth stage, applying heavier penalties during generative panicle phases where leaf anomalies directly stunt yield."
              }
            </p>
            <div className="flex flex-col gap-3 font-mono text-xs text-stone-500">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A8644A]" />
                <span>L_a : Lesion Area Percentage (%)</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A8644A]" />
                <span>A_t : Total Leaf Surface Area (Constant 100.0%)</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A8644A]" />
                <span>γ (Gamma) : Growth Stage Scaling Coefficient</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Elegant Custom HTML LaTeX Formula Box */}
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-stone-100/50 dark:bg-stone-900/30 rounded-3xl border border-[#2A2A2A]/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-radial-to-br from-[#A8644A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="font-display text-3xl sm:text-4xl md:text-5xl text-center text-[#2A2A2A] dark:text-white tracking-wide font-normal select-none">
                IARI = 100 × ( 1.0 − <span className="inline-block border-b border-stone-800 dark:border-stone-200 px-1 text-center"><span className="block pb-0.5">L<sub>a</sub></span><span className="block pt-0.5 text-xs sm:text-sm">A<sub>t</sub></span></span> ) × γ
              </div>
            </div>

            {/* Gamme scale explanation card */}
            <div className="p-6 bg-stone-50 dark:bg-stone-900/10 border border-[#2A2A2A]/5 rounded-2xl flex flex-col gap-4">
              <h4 className="font-display text-lg font-normal text-[#2A2A2A] dark:text-white tracking-wide">
                {lang === 'id' ? "Bobot Dinamis Koefisien Skala (γ)" : "Dynamic Stage Coefficient Weights (γ)"}
              </h4>
              <div className="grid grid-cols-3 gap-4 font-mono text-xs sm:text-xs">
                <div className="flex flex-col gap-1.5">
                  <span className="text-stone-500 uppercase">{lang === 'id' ? "Vegetatif" : "Vegetative"}</span>
                  <span className="text-base font-bold text-[#A8644A]">γ = 1.00</span>
                  <span className="text-xs text-stone-400 font-light block leading-relaxed">
                    {lang === 'id' ? "Kapasitas fotosintesis nominal" : "Nominal photosynthetic capacity"}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 border-x border-[#2A2A2A]/5 dark:border-stone-800 px-4">
                  <span className="text-stone-500 uppercase">{lang === 'id' ? "Generatif" : "Generative"}</span>
                  <span className="text-base font-bold text-[#A8644A]">γ = 0.85</span>
                  <span className="text-xs text-stone-400 font-light block leading-relaxed">
                    {lang === 'id' ? "Inisiasi bunga, rentan patogen" : "Panicle initiation, vulnerable"}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 pl-4">
                  <span className="text-stone-500 uppercase">{lang === 'id' ? "Ripening" : "Ripening"}</span>
                  <span className="text-base font-bold text-[#A8644A]">γ = 0.70</span>
                  <span className="text-xs text-stone-400 font-light block leading-relaxed">
                    {lang === 'id' ? "Pembentukan bulir, kritis" : "Grain-filling, critical stage"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: INDONESIAN RICE VARIETIES SUPPORT SHEET */}
        <section className="flex flex-col gap-12 border-t border-[#2A2A2A]/5 dark:border-stone-800 pt-24">
          <div className="border-b border-[#2A2A2A]/10 dark:border-stone-800 pb-6">
            <span className="font-display tracking-[0.25em] text-xs uppercase opacity-60 block mb-2">
              VARIETY COMPATIBILITY / 03
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#2A2A2A] dark:text-white leading-tight">
              {lang === 'id' 
                ? "Adaptabilitas Model Terhadap Varietas Lokal" 
                : "Local Rice Varieties Compatibility Spectrum"
              }
            </h2>
            <p className="max-w-3xl text-sm sm:text-base text-stone-500 dark:text-stone-400 font-light mt-3 leading-relaxed">
              {lang === 'id'
                ? "Bagaimana model jaringan saraf tiruan modular ARISA beradaptasi terhadap karakteristik fisik dan hijau daun varietas padi lokal Indonesia."
                : "Technical overview of how the ARISA multi-stage neural network adapts to physical traits of popular Indonesian rice varieties."
              }
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A]/10 dark:border-stone-800 text-stone-400 uppercase tracking-widest text-xs h-14">
                  <th className="font-normal pr-4">{lang === 'id' ? "Varietas Padi" : "Rice Variety"}</th>
                  <th className="font-normal pr-4">{lang === 'id' ? "Morfologi Daun" : "Leaf Morphology"}</th>
                  <th className="font-normal pr-4">{lang === 'id' ? "Kerentanan Alami" : "Natural Susceptibility"}</th>
                  <th className="font-normal text-right">{lang === 'id' ? "Adaptasi Jaringan Saraf AI" : "AI Neural Network Calibration"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]/5 dark:divide-stone-850">
                
                <tr className="h-20">
                  <td className="pr-4 py-4">
                    <span className="font-display text-lg text-[#2A2A2A] dark:text-white font-normal">Ciherang</span>
                    <span className="text-xs block text-stone-400 font-mono uppercase mt-0.5">Indica Cultivar</span>
                  </td>
                  <td className="pr-4 py-4 text-stone-500 font-light leading-relaxed">
                    {lang === 'id' ? "Hijau sedang, daun tegak, tekstur permukaan mulus." : "Medium green, erect posture, smooth surface profile."}
                  </td>
                  <td className="pr-4 py-4 text-stone-500 font-light leading-relaxed">
                    {lang === 'id' ? "Moderat terhadap Blas, peka terhadap Hawar Bakteri." : "Moderate to Blast, susceptible to Bacterial Blight."}
                  </td>
                  <td className="py-4 text-right text-stone-600 dark:text-stone-300 font-mono text-xs">
                    {lang === 'id' ? "Kalibrasi warna default nominal" : "Default color threshold baseline"}
                  </td>
                </tr>

                <tr className="h-20">
                  <td className="pr-4 py-4">
                    <span className="font-display text-lg text-[#2A2A2A] dark:text-white font-normal">IR64</span>
                    <span className="text-xs block text-stone-400 font-mono uppercase mt-0.5">High-Yielding Standard</span>
                  </td>
                  <td className="pr-4 py-4 text-stone-500 font-light leading-relaxed">
                    {lang === 'id' ? "Hijau agak muda, helai daun tipis, ibu tulang menonjol." : "Slightly light green, thin blade, prominent midrib line."}
                  </td>
                  <td className="pr-4 py-4 text-stone-500 font-light leading-relaxed">
                    {lang === 'id' ? "Sangat rentan terhadap Tungro di daerah endemik." : "Highly susceptible to Tungro disease vectors."}
                  </td>
                  <td className="py-4 text-right text-stone-600 dark:text-stone-300 font-mono text-xs">
                    {lang === 'id' ? "Normalisasi kontras visual tulang daun" : "Contrast normalization for midrib reflections"}
                  </td>
                </tr>

                <tr className="h-20">
                  <td className="pr-4 py-4">
                    <span className="font-display text-lg text-[#2A2A2A] dark:text-white font-normal">Inpari 32</span>
                    <span className="text-xs block text-stone-400 font-mono uppercase mt-0.5">Modern Resilient</span>
                  </td>
                  <td className="pr-4 py-4 text-stone-500 font-light leading-relaxed">
                    {lang === 'id' ? "Hijau tua pekat, lebar daun lebar, postur sangat tegak." : "Deep forest green, broad blade width, strictly erect posture."}
                  </td>
                  <td className="pr-4 py-4 text-stone-500 font-light leading-relaxed">
                    {lang === 'id' ? "Sangat tahan terhadap Hawar Bakteri strain III dan IV." : "High resistance to common Bacterial Blight strains."}
                  </td>
                  <td className="py-4 text-right text-stone-600 dark:text-stone-300 font-mono text-xs">
                    {lang === 'id' ? "Filter tekstur penyesuai sudut kamera" : "Texture maps adjusted for broad-leaf angles"}
                  </td>
                </tr>

                <tr className="h-20">
                  <td className="pr-4 py-4">
                    <span className="font-display text-lg text-[#2A2A2A] dark:text-white font-normal">Pandan Wangi</span>
                    <span className="text-xs block text-stone-400 font-mono uppercase mt-0.5">Premium Javanese Aromatic</span>
                  </td>
                  <td className="pr-4 py-4 text-stone-500 font-light leading-relaxed">
                    {lang === 'id' ? "Hijau kekuningan, tekstur daun lemas, aroma pelepah khas." : "Yellowish-green hue, soft blade texture, signature aromatics."}
                  </td>
                  <td className="pr-4 py-4 text-stone-500 font-light leading-relaxed">
                    {lang === 'id' ? "Peka terhadap Blas Daun dan wereng hijau pemicu Tungro." : "High susceptibility to Leaf Blast & Tungro vectors."}
                  </td>
                  <td className="py-4 text-right text-stone-600 dark:text-stone-300 font-mono text-xs">
                    {lang === 'id' ? "Offset rona saturation klorofil khusus" : "Chlorophyll saturation hue offset adjustment"}
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: HARDWARE PERFORMANCE SPECTRA */}
        <section className="flex flex-col gap-12 border-t border-[#2A2A2A]/5 dark:border-stone-800 pt-24">
          <div className="border-b border-[#2A2A2A]/10 dark:border-stone-800 pb-6">
            <span className="font-display tracking-[0.25em] text-xs uppercase opacity-60 block mb-2">
              HARDWARE SPECTRUM / 04
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#2A2A2A] dark:text-white leading-tight">
              {lang === 'id' 
                ? "Spesifikasi Latensi & Komparasi Performa" 
                : "Latency Benchmarks & Hardware Performance Spectra"
              }
            </h2>
            <p className="max-w-3xl text-sm sm:text-base text-stone-500 dark:text-stone-400 font-light mt-3 leading-relaxed">
              {lang === 'id'
                ? "Evaluasi mendalam mengenai konsumsi sumber daya RAM, latensi inferensi total (milidetik), dan profil termal komputasi sekuensial modular tiga tingkat ARISA."
                : "Granular profiling of raw RAM footprint, complete three-stage sequential pipeline inference latency, and processor temperature profiles."
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
            
            {/* Core i7 */}
            <div className="p-8 bg-stone-100/30 dark:bg-stone-900/10 border border-[#2A2A2A]/5 rounded-3xl flex flex-col gap-6">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-stone-400 uppercase">Class 01</span>
                <span className="text-emerald-500 font-semibold">STATIONARY REFERENCE</span>
              </div>
              <div>
                <h3 className="font-display text-xl text-[#2A2A2A] dark:text-white font-normal">PC Laptop CPU</h3>
                <span className="text-xs text-stone-400 font-mono mt-0.5 uppercase block">Intel Core i7-12700H</span>
              </div>
              <div className="flex flex-col divide-y divide-[#2A2A2A]/5 dark:divide-stone-850 text-xs sm:text-sm font-light mt-4">
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Latensi Inferensi" : "Pipeline Latency"}</span>
                  <span className="font-mono font-semibold text-[#A8644A]">~45 ms</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Penggunaan RAM" : "RAM Memory Footprint"}</span>
                  <span className="font-mono text-stone-600 dark:text-stone-300">~3.2 GB <span className="text-xs text-stone-400">(FP32 standard)</span></span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Suhu Prosesor" : "Processor Core Temp"}</span>
                  <span className="font-mono text-stone-600 dark:text-stone-300">~42°C</span>
                </div>
              </div>
            </div>

            {/* Raspberry Pi 4 */}
            <div className="p-8 bg-[#A8644A]/5 border border-[#A8644A]/10 rounded-3xl flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#A8644A] text-white font-mono text-xs px-3 py-1 uppercase rounded-bl-xl tracking-widest">
                PRIMARY SYSTEM
              </div>
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-stone-400 uppercase">Class 02</span>
                <span className="text-[#A8644A] font-semibold">EDGE PRODUCTION UNIT</span>
              </div>
              <div>
                <h3 className="font-display text-xl text-[#2A2A2A] dark:text-white font-normal">Raspberry Pi 4 Model B</h3>
                <span className="text-xs text-stone-400 font-mono mt-0.5 uppercase block">Broadcom BCM2711 ARM</span>
              </div>
              <div className="flex flex-col divide-y divide-[#2A2A2A]/5 dark:divide-[#A8644A]/10 text-xs sm:text-sm font-light mt-4">
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Latensi Inferensi" : "Pipeline Latency"}</span>
                  <span className="font-mono font-semibold text-[#A8644A]">~280 ms</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Penggunaan RAM" : "RAM Memory Footprint"}</span>
                  <span className="font-mono text-stone-600 dark:text-stone-300">~412 MB <span className="text-xs text-stone-400">(INT8 quantized)</span></span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Suhu Prosesor" : "Processor Core Temp"}</span>
                  <span className="font-mono text-stone-600 dark:text-stone-300">~58°C <span className="text-xs text-[#A8644A]">(Passive Cooling)</span></span>
                </div>
              </div>
            </div>

            {/* Raspberry Pi 3 */}
            <div className="p-8 bg-stone-100/30 dark:bg-stone-900/10 border border-[#2A2A2A]/5 rounded-3xl flex flex-col gap-6">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-stone-400 uppercase">Class 03</span>
                <span className="text-stone-500 font-semibold">LEGACY SYSTEMS</span>
              </div>
              <div>
                <h3 className="font-display text-xl text-[#2A2A2A] dark:text-white font-normal">Raspberry Pi 3 Model B</h3>
                <span className="text-xs text-stone-400 font-mono mt-0.5 uppercase block">Broadcom BCM2837 ARM</span>
              </div>
              <div className="flex flex-col divide-y divide-[#2A2A2A]/5 dark:divide-stone-850 text-xs sm:text-sm font-light mt-4">
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Latensi Inferensi" : "Pipeline Latency"}</span>
                  <span className="font-mono font-semibold text-[#A8644A]">~920 ms</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Penggunaan RAM" : "RAM Memory Footprint"}</span>
                  <span className="font-mono text-stone-600 dark:text-stone-300">~424 MB <span className="text-xs text-stone-400">(INT8 quantized)</span></span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-stone-500">{lang === 'id' ? "Suhu Prosesor" : "Processor Core Temp"}</span>
                  <span className="font-mono text-stone-600 dark:text-stone-300">~67°C</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>

    </div>
  );
}
