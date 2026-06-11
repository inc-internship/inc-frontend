import {
  mapCreatePaymentResponse,
  mapCurrentSubscriptionResponse,
  mapSubscriptionPlansResponse,
} from './billing.mappers'

describe('billing mappers', () => {
  describe('mapCreatePaymentResponse', () => {
    it('maps backend checkout url response', () => {
      expect(
        mapCreatePaymentResponse({ checkoutUrl: 'https://checkout.stripe.com/c/pay/session' }),
      ).toEqual({
        url: 'https://checkout.stripe.com/c/pay/session',
      })
    })

    it('throws error with response preview when redirect url is missing', () => {
      expect(() => mapCreatePaymentResponse({ paymentUrl: '', foo: 'bar' })).toThrow(
        'Payment creation response has no redirect url. Response: {"paymentUrl":"","foo":"bar"}',
      )
    })
  })

  describe('mapSubscriptionPlansResponse', () => {
    it('maps backend subscription plans', () => {
      expect(
        mapSubscriptionPlansResponse({
          data: [
            {
              currency: 'USD',
              durationDays: 1,
              id: 'day-plan',
              name: '1 Day',
              price: '10',
            },
          ],
        }),
      ).toEqual([
        {
          currency: 'USD',
          durationDays: 1,
          id: 'day-plan',
          name: '1 Day',
          price: '10',
        },
      ])
    })

    it('returns empty plans for unexpected response', () => {
      expect(mapSubscriptionPlansResponse({ foo: 'bar' })).toEqual([])
    })
  })

  describe('mapCurrentSubscriptionResponse', () => {
    it('maps backend current subscription response', () => {
      expect(
        mapCurrentSubscriptionResponse({
          accountType: 'BUSINESS',
          expiresAt: '2026-06-12T00:00:00.000Z',
          nextPaymentDate: '2026-06-13T00:00:00.000Z',
          subscriptions: [
            {
              autoRenewal: true,
              endDate: '2026-06-12T00:00:00.000Z',
              id: 'subscription-id',
              planName: '1 Month',
              price: '100',
              startDate: '2026-05-12T00:00:00.000Z',
              status: 'ACTIVE',
            },
          ],
        }),
      ).toEqual({
        autoRenewal: true,
        endDateOfSubscription: '2026-06-12T00:00:00.000Z',
        nextPaymentDate: '2026-06-13T00:00:00.000Z',
        planName: '1 Month',
      })
    })

    it('returns null for backend response without active subscription dates', () => {
      expect(
        mapCurrentSubscriptionResponse({
          accountType: 'PERSONAL',
          expiresAt: null,
          nextPaymentDate: null,
          subscriptions: [],
        }),
      ).toBeNull()
    })

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
      })
    })

    it('returns null for empty envelope and unrelated objects', () => {
      expect(mapCurrentSubscriptionResponse({ data: [] })).toBeNull()
      expect(mapCurrentSubscriptionResponse({ data: null, hasAutoRenewal: true })).toBeNull()
      expect(mapCurrentSubscriptionResponse({ foo: 'bar' })).toBeNull()
    })
  })
})
