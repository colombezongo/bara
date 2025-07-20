import type {
  VoiceRecognitionResult,
  VoiceRecognitionCallbacks,
  VoiceRecognitionConfig,
  SupportedLanguage,
  VoiceRecognitionState,
} from "../types/index"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

export class VoiceRecognitionService {
  private state: VoiceRecognitionState = {
    isListening: false,
    currentText: "",
    isProcessing: false,
    currentLanguage: "fr-FR",
    silenceTimer: null,
  }

  private callbacks: VoiceRecognitionCallbacks | null = null
  private config: VoiceRecognitionConfig = {
    language: "fr-FR",
    silenceTimeout: 5000, // 5 secondes
    continuous: true,
    interimResults: true,
  }

  private recognition: SpeechRecognition | null = null

  // Langues supportées selon vos spécifications
  private supportedLanguages: SupportedLanguage[] = [
    {
      code: "fr-FR",
      name: "Français",
      flag: "🇫🇷",
      nativeCode: "fr-FR",
    },
    {
      code: "en-US",
      name: "English",
      flag: "🇺🇸",
      nativeCode: "en-US",
    },
    {
      code: "bci-CI",
      name: "Baoulé",
      flag: "🇨🇮",
      nativeCode: "fr-FR", // Fallback vers français
    },
    {
      code: "bm-ML",
      name: "Bambara",
      flag: "🇲🇱",
      nativeCode: "fr-FR", // Fallback vers français
    },
  ]

  constructor() {
    this.initializeSpeechRecognition()
  }

  private initializeSpeechRecognition() {
    try {
      // Utiliser l'API Web Speech
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        console.error("❌ API Web Speech non supportée")
        return
      }

      this.recognition = new SpeechRecognition()
      this.setupVoiceRecognition()
      console.log("✅ API Web Speech initialisée")
    } catch (error) {
      console.error("❌ Erreur initialisation reconnaissance vocale:", error)
    }
  }

  private setupVoiceRecognition() {
    if (!this.recognition) return

    this.recognition.continuous = this.config.continuous
    this.recognition.interimResults = this.config.interimResults
    this.recognition.lang = this.config.language

    this.recognition.onstart = this.onSpeechStart
    this.recognition.onend = this.onSpeechEnd
    this.recognition.onerror = this.onSpeechError
    this.recognition.onresult = this.onSpeechResults
  }

  private onSpeechStart = () => {
    console.log("🎤 Reconnaissance vocale démarrée")
    this.state.isListening = true
    if (this.callbacks?.onStart) {
      this.callbacks.onStart()
    }
  }

  private onSpeechEnd = () => {
    console.log("🔇 Fin de la reconnaissance vocale")
    this.state.isListening = false
    this.clearSilenceTimer()
    if (this.callbacks?.onEnd) {
      this.callbacks.onEnd()
    }
  }

  private onSpeechError = (event: SpeechRecognitionErrorEvent) => {
    console.error("❌ Erreur reconnaissance vocale:", event.error)
    this.state.isListening = false
    this.clearSilenceTimer()
    if (this.callbacks?.onError) {
      this.callbacks.onError(`Erreur reconnaissance vocale: ${event.error}`)
    }
  }

  private onSpeechResults = (event: SpeechRecognitionEvent) => {
    let finalTranscript = ""
    let interimTranscript = ""

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalTranscript += transcript
      } else {
        interimTranscript += transcript
      }
    }

    const currentText = finalTranscript || interimTranscript
    console.log("✅ Résultat reconnaissance:", currentText, "Final:", !!finalTranscript)

    this.state.currentText = currentText

    if (this.callbacks?.onResult) {
      this.callbacks.onResult({
        transcript: currentText,
        confidence: 0.9,
        isFinal: !!finalTranscript,
      })
    }

    // Démarrer le timer de silence après un résultat final
    if (finalTranscript) {
      this.startSilenceTimer()
    } else {
      this.resetSilenceTimer()
    }
  }

  private startSilenceTimer() {
    this.clearSilenceTimer()
    this.state.silenceTimer = setTimeout(() => {
      console.log("⏰ 5 secondes de silence détectées - Fin de la recherche")
      this.stopRecognition()
      if (this.callbacks?.onSilenceDetected) {
        this.callbacks.onSilenceDetected()
      }
    }, this.config.silenceTimeout)
  }

  private resetSilenceTimer() {
    if (this.state.silenceTimer) {
      clearTimeout(this.state.silenceTimer)
      this.startSilenceTimer()
    }
  }

  private clearSilenceTimer() {
    if (this.state.silenceTimer) {
      clearTimeout(this.state.silenceTimer)
      this.state.silenceTimer = null
    }
  }

  /**
   * Démarrer la reconnaissance vocale avec callbacks
   */
  async startRecognition(callbacks: VoiceRecognitionCallbacks): Promise<void> {
    try {
      if (!this.recognition) {
        throw new Error("Reconnaissance vocale non initialisée")
      }

      this.callbacks = callbacks
      this.state.currentText = ""
      this.state.isProcessing = false

      // Obtenir le code de langue natif pour Web Speech API
      const selectedLang = this.supportedLanguages.find((lang) => lang.code === this.config.language)
      const nativeLanguageCode = selectedLang?.nativeCode || "fr-FR"

      console.log(`🎯 Démarrage reconnaissance en ${selectedLang?.name} (${nativeLanguageCode})`)

      this.recognition.lang = nativeLanguageCode
      await this.recognition.start()
    } catch (error) {
      console.error("❌ Erreur démarrage reconnaissance:", error)
      if (this.callbacks?.onError) {
        this.callbacks.onError("Impossible de démarrer la reconnaissance vocale")
      }
      throw error
    }
  }

  /**
   * Arrêter la reconnaissance vocale
   */
  async stopRecognition(): Promise<void> {
    try {
      if (this.recognition) {
        await this.recognition.stop()
      }
      this.clearSilenceTimer()
      this.state.isListening = false
      console.log("🛑 Reconnaissance vocale arrêtée")
    } catch (error) {
      console.error("❌ Erreur arrêt reconnaissance:", error)
    }
  }

  /**
   * Vérifier si la reconnaissance vocale est supportée
   */
  isVoiceRecognitionSupported(): boolean {
    return !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition)
  }

  /**
   * Changer la langue de reconnaissance
   */
  setLanguage(lang: string) {
    const supportedLang = this.supportedLanguages.find((l) => l.code === lang)
    if (supportedLang) {
      this.config.language = lang
      this.state.currentLanguage = lang
      if (this.recognition) {
        this.recognition.lang = supportedLang.nativeCode || "fr-FR"
      }
      console.log(`🌍 Langue changée vers: ${supportedLang.name}`)
    } else {
      console.warn(`⚠️ Langue non supportée: ${lang}`)
    }
  }

  /**
   * Obtenir les langues supportées
   */
  getSupportedLanguages(): string[] {
    return this.supportedLanguages.map((lang) => lang.code)
  }

  /**
   * Obtenir les langues supportées avec détails
   */
  getSupportedLanguagesDetails(): SupportedLanguage[] {
    return this.supportedLanguages
  }

  /**
   * Configurer le timeout de silence
   */
  setSilenceTimeout(timeout: number) {
    this.config.silenceTimeout = timeout
    console.log(`⏱️ Timeout de silence configuré à ${timeout}ms`)
  }

  /**
   * Obtenir l'état actuel
   */
  getState(): VoiceRecognitionState {
    return { ...this.state }
  }

  /**
   * Vérifier si la reconnaissance est en cours
   */
  getIsListening(): boolean {
    return this.state.isListening
  }

  /**
   * Nettoyer les ressources
   */
  destroy() {
    this.clearSilenceTimer()
    if (this.recognition) {
      this.recognition.abort()
    }
    this.callbacks = null
    console.log("🧹 Service de reconnaissance vocale nettoyé")
  }
}

export const voiceRecognitionService = new VoiceRecognitionService()
