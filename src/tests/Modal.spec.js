import { mount } from '@vue/test-utils';
import Modal from '@/components/Modal.vue';
import vuetify from '@/tests/vuetify-plugin';
import { nextTick } from 'vue';

let wrapper;

beforeEach(() => {
  const el = document.createElement('div');
  el.id = 'teleport-target';
  document.body.appendChild(el);

  wrapper = mount(Modal, {
    global: {
      plugins: [vuetify],
      stubs: {
        VDialog: {
          name: 'VDialog',
          template: '<div class="v-dialog-stub"><slot /></div>',
          props: ['modelValue'],
        },
        VCard: {
          name: 'VCard',
          template: '<div class="v-card-stub"><slot /></div>',
          props: ['modelValue'],
        },
        VCardText: {
          name: 'VCardText',
          template: '<div class="v-card-text-stub"><slot /></div>',
          props: ['modelValue'],
        },
        VCardActions: {
          name: 'VCardActions',
          template: '<div class="v-card-actions-stub"><slot /></div>',
          props: ['modelValue'],
        },
        VBtn: {
          name: 'VBtn',
          template: '<div class="v-btn-stub" :disabled="disabled" :color="color"><slot /></div>',
          props: ['disabled', 'color'],
        },
        VTextField: {
          name: 'VTextField',
          template: '<input class="v-text-field-stub" :label="label" :value="value" @input="$emit(\'input\', $event.target.value)" />',
          props: ['label', 'value'],
        },
        VSelect: {
          name: 'VSelect',
          template: `
            <select class="v-select-stub" :label="label" :value="value" @change="$emit('update:value', $event.target.value)">
              <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
            </select>
          `,
          props: ['items', 'label', 'rules', 'value'],
        },
        VContainer: {
          name: 'VContainer',
          template: '<div class="v-container-stub"><slot /></div>',
          props: ['modelValue'],
        },
        VRow: {
          name: 'VRow',
          template: '<div class="v-row-stub"><slot /></div>',
          props: ['modelValue'],
        },
        VCol: {
          name: 'VCol',
          template: '<div class="v-col-stub" :cols="cols" :md="md"><slot /></div>',
          props: ['cols', 'md'],
        },
      }
    },
    props: {
      visible: true,
      quotaData: {
        quota: 1,
        reason: ''
      }
    },
    attachTo: document.getElementById('teleport-target'),
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  wrapper.unmount()
});

describe('Modal.vue', () => {

  test('The dialog is rendering', async () => {
    await nextTick();
    const dialog = wrapper.find('.v-dialog-stub');
    expect(dialog.exists()).toBe(true);
  });

  test('Sets isOpen based on visible prop', async () => {
    await wrapper.setProps({ visible: false });
    await nextTick();
    expect(wrapper.vm.isOpen).toBe(false);
  });

  test('Renders quota and reason fields', async () => {
    await nextTick();
    const quotaField = wrapper.find('[data-testid="quota-field"]');
    const reasonField = wrapper.find('[data-testid="reason-field"]');
    expect(quotaField.exists()).toBe(true);
    expect(reasonField.exists()).toBe(true);
  });

  test('Renders other reason field when "Other" reason is selected', async () => {
    await wrapper.setProps({ quotaData: { quota: 1, reason: 'Other' } });
    await nextTick();
    const otherReasonField = wrapper.find('[data-testid="other-reason-field"]');
    expect(otherReasonField.exists()).toBe(true);
  });

  test('The save button is disabled when reason is not being selected', async () => {
    await wrapper.setProps({ quotaData: { quota: 1, reason: '' } });
    await nextTick();
    const saveButton = wrapper.find('[data-testid="save-button"]');
    expect(saveButton.attributes('disabled')).toBe('true');
  });
  
  test('The save button is disabled when other reason text field is not being filled', async () => {
    await wrapper.setProps({ quotaData: { quota: 1, reason: 'Other' } });
    await nextTick();    
    const otherReasonField = wrapper.find('[data-testid="other-reason-field"]');
    await otherReasonField.setValue('');
    const saveButton = wrapper.find('[data-testid="save-button"]');
    expect(saveButton.attributes('disabled')).toBe('true');
  });
  
  test('The save button is disabled when quota is not being changed', async () => {
    await wrapper.setData({ quotaData: { quota: 1, reason: 'Other' } });
    await nextTick();
    await wrapper.setProps({ quotaData: { quota: 1, reason: 'Other' } });
    const saveButton = wrapper.find('[data-testid="save-button"]');
    expect(saveButton.attributes('disabled')).toBe('true');
  });
  
  test('When adding quota, the correct options are being rendered: "Subscriber canceled flight", "Airline canceled flight", "Customer compensation" or "Other"', async () => {
    await wrapper.setData({ quotaData: { quota: 1, reason: '' } });
    await nextTick();
    wrapper.vm.updateReasonOptions(true);
    await nextTick();
    const select = wrapper.find('[data-testid="reason-field"]');
    const options = select.findAll('option');
    expect(options.length).toBe(4);
    expect(options.at(0).text()).toBe('Subscriber canceled flight');
    expect(options.at(1).text()).toBe('Airline canceled flight');
    expect(options.at(2).text()).toBe('Customer compensation');
    expect(options.at(3).text()).toBe('Other');
  });
  
  test('When substracting quota, the correct options are being rendered: "Flight not redeposited after a flight cancellation", "Subscriber had log in or password issues", "Subscriber had issues when booking", "Subscription has not renewed correctly", "Other"', async () => {
    await wrapper.setData({ quotaData: { quota: 2, reason: '' } });
    await nextTick();
    wrapper.vm.updateReasonOptions(false);
    await nextTick();

    const select = wrapper.find('[data-testid="reason-field"]');
    const options = select.findAll('option');
    
    expect(options.length).toBe(5);
    expect(options.at(0).text()).toBe('Flight not redeposited after a flight cancellation');
    expect(options.at(1).text()).toBe('Subscriber had login or password issues');
    expect(options.at(2).text()).toBe('Subscriber had issues when booking');
    expect(options.at(3).text()).toBe('Subscription has not renewed correctly');
    expect(options.at(4).text()).toBe('Other');
  });
  
  test('Quota shouldn\'t be higher than 3 flights', async () => {
    await wrapper.setData({ quotaData: { quota: 4, reason: '' } });
    await nextTick();
    const saveButton = wrapper.find('[data-testid="save-button"]');
    expect(saveButton.attributes('disabled')).toBe('true');
  });
  
  test('Quota shouldn\'t be lower than 0 flights', async () => {
    await wrapper.setData({ quotaData: { quota: -2, reason: '' } });
    await nextTick();
    const saveButton = wrapper.find('[data-testid="save-button"]');
    expect(saveButton.attributes('disabled')).toBe('true');
  });
});