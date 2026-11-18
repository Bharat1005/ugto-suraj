/**
 * UGTO SURAJ — Official GA4 & Google Tag Manager Analytics Suite
 * Container ID: GTM-K36KQRTM
 * 
 * Tracks:
 * - Page Views with dynamic traffic source & UTM parameter attribution
 * - Visitor device category & screen metrics
 * - CTA Button Clicks ('Explore Our Journey')
 * - Social Media Outbound Clicks (Instagram & LinkedIn)
 * - Journey Modal / Brand Story engagement
 * - Interactive Lookbook / Visual Showcase interactions
 * - Engagement Time Milestones (10s, 30s, 60s)
 */

(function () {
  'use strict';

  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];

  /**
   * Safe dataLayer push wrapper
   */
  function pushDataLayer(eventData) {
    try {
      window.dataLayer.push(eventData);
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('[GA4 / GTM Event]:', eventData);
      }
    } catch (e) {
      console.error('[Analytics Error]:', e);
    }
  }

  /**
   * Parse UTM parameters & Traffic Source
   */
  function getTrafficAttribution() {
    var params = new URLSearchParams(window.location.search);
    var referrer = document.referrer || '';
    var source = params.get('utm_source') || '';
    var medium = params.get('utm_medium') || '';
    var campaign = params.get('utm_campaign') || '';
    var term = params.get('utm_term') || '';
    var content = params.get('utm_content') || '';

    if (!source) {
      if (!referrer) {
        source = 'direct';
        medium = 'none';
      } else if (referrer.indexOf('instagram.com') > -1) {
        source = 'instagram';
        medium = 'social';
      } else if (referrer.indexOf('linkedin.com') > -1) {
        source = 'linkedin';
        medium = 'social';
      } else if (referrer.indexOf('google.com') > -1) {
        source = 'google';
        medium = 'organic';
      } else if (referrer.indexOf('facebook.com') > -1) {
        source = 'facebook';
        medium = 'social';
      } else if (referrer.indexOf('t.co') > -1 || referrer.indexOf('twitter.com') > -1 || referrer.indexOf('x.com') > -1) {
        source = 'x';
        medium = 'social';
      } else {
        try {
          var refUrl = new URL(referrer);
          source = refUrl.hostname;
          medium = 'referral';
        } catch (err) {
          source = 'other';
          medium = 'referral';
        }
      }
    }

    return {
      source: source,
      medium: medium || 'organic',
      campaign: campaign || '(not set)',
      term: term || '(not set)',
      content: content || '(not set)',
      referrer: referrer
    };
  }

  /**
   * Determine device category
   */
  function getDeviceCategory() {
    var width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  var attribution = getTrafficAttribution();
  var device = getDeviceCategory();

  // 1. Initial Page View tracking
  pushDataLayer({
    event: 'page_view',
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    traffic_source: attribution.source,
    traffic_medium: attribution.medium,
    traffic_campaign: attribution.campaign,
    traffic_referrer: attribution.referrer,
    device_category: device,
    screen_resolution: window.screen.width + 'x' + window.screen.height,
    viewport_size: window.innerWidth + 'x' + window.innerHeight,
    brand: 'UGTO SURAJ',
    timestamp: new Date().toISOString()
  });

  /**
   * 2. CTA Click Tracking
   */
  function trackCtaClick(ctaName, ctaLocation, destination) {
    pushDataLayer({
      event: 'cta_click',
      cta_name: ctaName || 'Explore Our Journey',
      cta_location: ctaLocation || 'hero_primary',
      destination: destination || 'journey_modal',
      traffic_source: attribution.source,
      device_category: getDeviceCategory(),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 3. Social Media Link Click Tracking
   */
  function trackSocialClick(platform, destinationUrl, location) {
    pushDataLayer({
      event: 'social_click',
      social_platform: platform, // 'instagram' | 'linkedin'
      destination_url: destinationUrl,
      link_location: location || 'header',
      traffic_source: attribution.source,
      device_category: getDeviceCategory(),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 4. User Engagement Milestones (10s, 30s, 60s)
   */
  var activeSeconds = 0;
  var milestones = [10, 30, 60, 120];
  var reachedMilestones = {};

  var engagementTimer = setInterval(function () {
    if (!document.hidden) {
      activeSeconds++;
      for (var i = 0; i < milestones.length; i++) {
        var ms = milestones[i];
        if (activeSeconds >= ms && !reachedMilestones[ms]) {
          reachedMilestones[ms] = true;
          pushDataLayer({
            event: 'user_engagement',
            engagement_time_msec: ms * 1000,
            engagement_milestone_seconds: ms,
            traffic_source: attribution.source,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
  }, 1000);

  /**
   * 5. Bind Click Listeners on DOM Ready
   */
  document.addEventListener('DOMContentLoaded', function () {
    // Primary CTA: Explore Our Journey
    var ctaButtons = document.querySelectorAll('[data-track="cta-journey"]');
    ctaButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var loc = btn.getAttribute('data-location') || 'hero';
        trackCtaClick('Explore Our Journey', loc, 'journey_modal');
      });
    });

    // Instagram links
    var instagramLinks = document.querySelectorAll('a[href*="instagram.com"]');
    instagramLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        var loc = link.getAttribute('data-location') || (link.closest('header') ? 'header' : 'footer');
        trackSocialClick('instagram', link.href, loc);
      });
    });

    // LinkedIn links
    var linkedinLinks = document.querySelectorAll('a[href*="linkedin.com"]');
    linkedinLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        var loc = link.getAttribute('data-location') || (link.closest('header') ? 'header' : 'footer');
        trackSocialClick('linkedin', link.href, loc);
      });
    });

    // Track Gallery / Lookbook switcher clicks
    var galleryThumbs = document.querySelectorAll('[data-track="gallery-switch"]');
    galleryThumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var index = thumb.getAttribute('data-index');
        var title = thumb.getAttribute('data-title');
        pushDataLayer({
          event: 'gallery_view',
          gallery_item_index: index,
          gallery_item_title: title,
          timestamp: new Date().toISOString()
        });
      });
    });
  });

  // Expose methods globally for modular access
  window.ugtoAnalytics = {
    pushDataLayer: pushDataLayer,
    trackCtaClick: trackCtaClick,
    trackSocialClick: trackSocialClick,
    getAttribution: function () { return attribution; }
  };
})();

