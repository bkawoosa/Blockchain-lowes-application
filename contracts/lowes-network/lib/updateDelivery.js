/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Lowes submits transaction
 * @param {com.lowes.network.updateDeliveryOrder} updateTransaction
 * @transaction
 */
function updateDeliveryOrder(updateTransaction) {

    for (field in updateTransaction) {
        if ((field.indexOf('$') != 0 && field != "transactionId") && (field != "deliveryOrder" && field != "timestamp")) {
            updateTransaction.deliveryOrder[field] = updateTransaction[field];
        }
    }

    return getAssetRegistry('com.lowes.network.DeliveryOrder').then(function (orderRegistry) {

        // Finally add assets to their registries
        return orderRegistry.update(updateTransaction.deliveryOrder);
    }).then(function(){

        // Emit a notification that a new order has been created
        var deliveryEvent = getFactory().newEvent('com.lowes.network.events', 'DeliveryUpdated');
        deliveryEvent.purchaseOrder = updateTransaction.deliveryOrder.purchaseOrder;
        emit(deliveryEvent);
    });
}