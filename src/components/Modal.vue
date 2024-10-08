<script lang="ts">
import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'Modal',
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      quotaData: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        isOpen: this.visible,
        quota: this.quotaData.quota || 0,
        reason: this.quotaData.reason || '',
        otherReason: '',
        reasonOptions: [] as string[],
      };
    },
    watch: {
      visible(val) {
        this.isOpen = val;
        this.resetFields();
      },
    },
    methods: {
      incrementQuota() {
        if (this.quota < 3) {
          this.quota += 1;
          this.updateReasonOptions(this.quota > this.quotaData.quota);
        }
      },
      decrementQuota() {
        if (this.quota > 0) {
          this.quota -= 1;
          this.updateReasonOptions(this.quota > this.quotaData.quota);
        }
      },
      save() {
        const reasonToSave = this.reason === 'Other' ? this.otherReason : this.reason;
        this.$emit('save', { quota: this.quota, reason: reasonToSave });
        this.close();
      },
      close() {
        this.$emit('update:visible', false);
      },
      resetFields() {
        this.quota = this.quotaData.quota || 0;
        this.reason = this.quotaData.reason || '';
        this.otherReason = '';
        this.updateReasonOptions(true);
      },
      updateReasonOptions(isAdding: boolean) {
        this.reasonOptions = isAdding
          ? ['Subscriber canceled flight', 'Airline canceled flight', 'Customer compensation', 'Other']
          : ['Flight not redeposited after a flight cancellation', 'Subscriber had login or password issues', 'Subscriber had issues when booking', 'Subscription has not renewed correctly', 'Other'];
      },
    },
    computed: {
      isValid() {
        const reasonToSave = this.reason === 'Other' ? this.otherReason : this.reason;
        return (
          this.quota >= 0 &&
          this.quota <= 3 &&
          !!this.reason &&
          (this.reason !== 'Other' || !!this.otherReason) &&
          (this.quota !== this.quotaData.quota || reasonToSave !== this.quotaData.reason)
        )
      },
      isQuotaUpdated() {
        return this.quota !== this.quotaData.quota || this.reason !== this.quotaData.reason;
      },
    },
});
</script>

<template>
  <v-dialog v-model="isOpen" max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Edit flights
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="close"
        ></v-btn>
      </v-card-title>
      <v-card-subtitle>Add or remove flights from the subscriber</v-card-subtitle>
      <v-card-subtitle>Current flights left: {{ quotaData.quota }}</v-card-subtitle>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="d-flex align-center flex-column my-auto">
              <div class="d-flex justify-center mt-auto text-h6">
                Flights left
              </div>
              <div class="d-flex align-center justify-space-evenly my-auto" data-testid="quota-field">
                <v-btn icon @click="decrementQuota" class="mx-2">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <div class="text-h3 mx-2">
                  {{ quota }}
                </div>
                <v-btn icon @click="incrementQuota" class="mx-2">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </v-col>       
            <v-col cols="12" md="8">
              <v-select
                v-model="reason"
                :items="reasonOptions"
                label="What is the motive?"
                :rules="[v => !!v || 'Reason is required']"
                data-testid="reason-field"
              />
              <v-text-field
                v-if="quotaData.reason === 'Other' || reason === 'Other'"
                v-model="otherReason"
                label="Please specify"
                :rules="[v => !!v || 'This field is required']"
                data-testid="other-reason-field"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="save" :disabled="!isValid" color="primary" data-testid="save-button">Save Changes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .headline {
    font-size: 20px;
  }
</style>