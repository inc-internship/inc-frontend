import { mapCreatePaymentResponse, mapCurrentSubscriptionResponse } from './billing.mappers'

describe('billing mappers', () => {
  describe('mapCreatePaymentResponse', () => {
    it('throws error with response preview when redirect url is missing', () => {
      expect(() => mapCreatePaymentResponse({ paymentUrl: '', foo: 'bar' })).toThrow(
        'Payment creation response has no redirect url. Response: {"paymentUrl":"","foo":"bar"}',
      )
    })
  })

  describe('mapCurrentSubscriptionResponse', () => {
    it('maps direct subscription response with next payment alias', () => {
      expect(
        mapCurrentSubscriptionResponse({
          autoRenewal: true,
          endDateOfSubscription: '2026-06-12T00:00:00.000Z',
          nextPayment: '2026-06-13T00:00:00.000Z',
          typeSubscription: 'WEEKLY',
        }),
      ).toEqual({
        autoRenewal: true,
        endDateOfSubscription: '2026-06-12T00:00:00.000Z',
        nextPaymentDate: '2026-06-13T00:00:00.000Z',
        typeSubscription: 'WEEKLY',
      })
    })

    it('maps direct subscription response when passthrough data is not an envelope array', () => {
      expect(
        mapCurrentSubscriptionResponse({
          autoRenewal: true,
          data: '2026-06-12',
          endDateOfSubscription: '2026-06-12T00:00:00.000Z',
          typeSubscription: 'DAY',
        }),
      ).toEqual({
        autoRenewal: true,
        endDateOfSubscription: '2026-06-12T00:00:00.000Z',
        nextPaymentDate: undefined,
        typeSubscription: 'DAY',
      })
    })

    it('maps envelope response and lets top-level auto-renewal override subscription value', () => {
      expect(
        mapCurrentSubscriptionResponse({
          data: [
            {
              autoRenewal: true,
              dateOfNextPayment: '2026-06-13T00:00:00.000Z',
              endDateOfSubscription: '2026-06-12T00:00:00.000Z',
              typeSubscription: 'DAY',
            },
          ],
          hasAutoRenewal: false,
        }),
      ).toEqual({
        autoRenewal: false,
        endDateOfSubscription: '2026-06-12T00:00:00.000Z',
        nextPaymentDate: '2026-06-13T00:00:00.000Z',
        typeSubscription: 'DAY',
      })
    })

    it('does not reuse subscription end date as next payment date fallback', () => {
      expect(
        mapCurrentSubscriptionResponse({
          endDateOfSubscription: '2026-06-12T00:00:00.000Z',
          typeSubscription: 'MONTHLY',
        }),
      ).toEqual({
        autoRenewal: undefined,
        endDateOfSubscription: '2026-06-12T00:00:00.000Z',
        nextPaymentDate: undefined,
        typeSubscription: 'MONTHLY',
      })
    })

    it('returns null for empty envelope and unrelated objects', () => {
      expect(mapCurrentSubscriptionResponse({ data: [] })).toBeNull()
      expect(mapCurrentSubscriptionResponse({ data: null, hasAutoRenewal: true })).toBeNull()
      expect(mapCurrentSubscriptionResponse({ foo: 'bar' })).toBeNull()
    })
  })
})
