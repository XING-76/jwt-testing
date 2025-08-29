import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UrlModal from '../UrlModal.vue';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('UrlModal 組件測試', () => {
  const defaultProps = {
    isVisible: true,
    url: 'https://example.com#jwt=test.jwt.token',
  };

  it('應該在 isVisible 為 true 時顯示 Modal', () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true);
  });

  it('應該在 isVisible 為 false 時隱藏 Modal', () => {
    const wrapper = mount(UrlModal, {
      props: {
        ...defaultProps,
        isVisible: false,
      },
    });

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false);
  });

  it('應該正確顯示傳入的 URL', () => {
    const testUrl = 'https://test.com#jwt=abc.def.ghi';
    const wrapper = mount(UrlModal, {
      props: {
        ...defaultProps,
        url: testUrl,
      },
    });

    expect(wrapper.text()).toContain(testUrl);
  });

  it('應該在點擊背景遮罩時觸發 close 事件', async () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    const backdrop = wrapper.find('.absolute.inset-0');
    await backdrop.trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('應該在點擊關閉按鈕時觸發 close 事件', async () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button');
    const closeButton = buttons[0]; // 關閉按鈕
    await closeButton.trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('應該在點擊複製按鈕時調用 clipboard API', async () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button');
    const copyButton = buttons[1]; // 複製按鈕
    await copyButton.trigger('click');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(defaultProps.url);
  });

  it('應該在複製失敗時在控制台輸出錯誤', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('複製失敗'));

    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button');
    const copyButton = buttons[1];
    await copyButton.trigger('click');

    expect(consoleSpy).toHaveBeenCalledWith('複製失敗:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('應該顯示正確的標題和描述文字', () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    expect(wrapper.text()).toContain('生成的跳轉 URL');
    expect(wrapper.text()).toContain('已成功生成 JWT 並構建跳轉 URL，即將自動跳轉');
  });

  it('應該包含正確的按鈕文字', () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button');
    expect(buttons[0].text()).toContain('關閉');
    expect(buttons[1].text()).toContain('複製 URL');
  });
});
