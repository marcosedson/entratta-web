export { BlogService } from './blog.service'
export { CityService } from './city.service'
export { SegmentService } from './segment.service'
export { ConfiguratorService } from './configurator.service'
export { SEOService, type SEOMetadata } from './seo.service'
export { PDFService } from './pdf.service'
export { EmailService } from './email.service'
export { WhatsAppService } from './whatsapp.service'
export { StorageService } from './storage.service'
export { ProductionQueueService } from './production-queue.service'

// LogoProcessingService não é exportado aqui (Node.js only - usada apenas em APIs)
// Importe diretamente: import { LogoProcessingService } from '@/lib/services/logo-processing.service'

// Advanced Image Processing (client-side)
// TODO: arquivo ./image-processing.ts não existe ainda — export comentado pra destravar dev/build
// export { AdvancedImageProcessingService } from './image-processing'
// export type {
//   QualityLevel,
//   ProcessingConfig,
//   ProcessingResult,
//   SVGLayer,
//   TAPFile,
//   ColorReport,
//   QualityMetrics,
// } from './image-processing'
