export const MAX_VALUE = 9999999999999
export const MIN_VALUE = -9999999999999
export const THEME_KEY = 'ThemeProvider.theme'
export const LANG_KEY = 'TranslateProvider.lang'
export const TAG_DISABLED_KEY = 'Tag.Disabled.'
export const FILTER_SELECTION_KEY = 'FilterSelection'
export const USER_COOKIE_KEY = 'UserKey'

// LOG
export const LOG_DIR = 'logs'
export const LOG_RETENTION_DAYS = 30
export const LOG_FLUSH_INTERVAL_MS = 2000
export const LOG_MAX_BATCH = 50
export const LOG_MAX_PENDING = 100
export const LOG_MAX_FILE_BYTES = 5 * 1024 * 1024
// debug só em desenvolvimento, para não gerar ruído nem crescer o arquivo em produção
export const LOG_MIN_LEVEL = process.env.NODE_ENV === 'development' ? 'debug' : 'info'

// PATHS
export const HOME_PATH = '/'
export const REGISTRATION_PATH = '/registration'
