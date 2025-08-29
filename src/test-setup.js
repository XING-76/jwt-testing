// 測試環境設置
import { TextEncoder, TextDecoder } from 'util';

// 為測試環境提供 TextEncoder 和 TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
