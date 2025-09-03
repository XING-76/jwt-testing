import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UrlModal from '../UrlModal.vue';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('UrlModal Component Test', () => {
  const defaultProps = {
    isVisible: true,
    url: 'https://example.com#jwt=test.jwt.token',
  };

  it('should display Modal when isVisible is true', () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true);
  });

  it('should hide Modal when isVisible is false', () => {
    const wrapper = mount(UrlModal, {
      props: {
        ...defaultProps,
        isVisible: false,
      },
    });

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false);
  });

  it('should correctly display the passed URL', () => {
    const testUrl = 'https://test.com#jwt=abc.def.ghi';
    const wrapper = mount(UrlModal, {
      props: {
        ...defaultProps,
        url: testUrl,
      },
    });

    expect(wrapper.text()).toContain(testUrl);
  });

  it('should trigger close event when clicking on background overlay', async () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    const backdrop = wrapper.find('.absolute.inset-0');
    await backdrop.trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('should trigger close event when clicking on close button', async () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button');
    const closeButton = buttons[0]; // Close button
    await closeButton.trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('should call clipboard API when clicking on copy button', async () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button');
    const copyButton = buttons[1]; // Copy button
    await copyButton.trigger('click');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(defaultProps.url);
  });

  it('should output error to console when copy fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));

    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button');
    const copyButton = buttons[1];
    await copyButton.trigger('click');

    expect(consoleSpy).toHaveBeenCalledWith('複製失敗:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should display correct title and description text', () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    expect(wrapper.text()).toContain('生成的跳轉 URL');
    expect(wrapper.text()).toContain('已成功生成 JWT 並構建跳轉 URL，即將自動跳轉');
  });

  it('should contain correct button text', () => {
    const wrapper = mount(UrlModal, {
      props: defaultProps,
    });

    const buttons = wrapper.findAll('button');
    expect(buttons[0].text()).toContain('關閉');
    expect(buttons[1].text()).toContain('複製 URL');
  });
});
