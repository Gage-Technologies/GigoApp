import * as RNIap from 'react-native-iap';
import Platform from 'react-native';

class InAppPurchases {
  purchaseUpdateSubscription: any;
  purchaseErrorSubscription: any;

  // initialize iap connection
  async init() {
    try {
      // attempt to initialize the iap connection
      const result = await RNIap.initConnection();
      console.log('iap connection initialized', result);

      // flush any failed purchases on android
      if (Platform.OS === 'android') {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }

      // get available products (define these)
      const products = await RNIap.getProducts(['your_product_id_1', 'your_product_id_2']);
      console.log('available products:', products);

      return true; // return true if initialization was successful
    } catch (error) {
      console.error('error initializing iap', error);
      if (error.message.includes('Billing is unavailable')) {
        console.log(
          'Billing is unavailable. This may be due to using an emulator or Play Store issues.',
        );

        return false; // return false to indicate initialization failed
      }
      throw error; // rethrow other errors
    }
  }

  // set up listeners
  setupListeners() {
    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase: RNIap.ProductPurchase) => {
        console.log('purchase', purchase);
        // handle purchase
        // you might want to call a method to validate the purchase here
      },
    );

    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(
      (error: RNIap.PurchaseError) => {
        console.error('purchaseErrorListener', error);
      },
    );
  }

  // remove listeners
  removeListeners() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  // method to request purchase
  async requestPurchase(sku: string) {
    try {
      await RNIap.requestPurchase(sku);
    } catch (error) {
      console.error('error in requestPurchase', error);
    }
  }

  // check if billing is available
  async isBillingAvailable() {
    try {
      const available = await RNIap.initConnection();
      return available;
    } catch (error) {
      console.error('error checking billing availability', error);
      return false;
    }
  }
}

export default new InAppPurchases();
