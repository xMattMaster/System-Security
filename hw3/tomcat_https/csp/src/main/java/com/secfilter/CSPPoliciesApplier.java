package com.secfilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Sample filter implementation to define a set of Content Security Policies.<br/>
 * This implementation has a dependency on Commons Codec API.<br/>
 * This filter set CSP policies using all HTTP headers defined into W3C specification.<br/>
 * <br/>
 * This implementation is oriented to be easily understandable and easily adapted.<br/>
 */
@WebFilter("/*")
public class CSPPoliciesApplier implements Filter {

    /** Configuration member to specify if web app use web fonts */
    public static final boolean APP_USE_WEBFONTS = false;

    /** Configuration member to specify if web app use videos or audios */
    public static final boolean APP_USE_AUDIOS_OR_VIDEOS = false;

    /**
     * Configuration member to specify if filter must add CSP directive used by Mozilla (Firefox)
     */
    public static final boolean INCLUDE_MOZILLA_CSP_DIRECTIVES = true;

    /** Filter configuration */
    @SuppressWarnings("unused")
    private FilterConfig filterConfig = null;

    /** List CSP HTTP Headers */
    private List<String> cspHeaders = new ArrayList<String>();

    /** Collection of CSP polcies that will be applied */
    private String policies = null;

    /**
     * Used to prepare (one time for all) set of CSP policies that will be applied on each HTTP
     * response.
     *
     * @see javax.servlet.Filter#init(javax.servlet.FilterConfig)
     */
    @Override
    public void init(FilterConfig fConfig) throws ServletException {
// Get filter configuration
        this.filterConfig = fConfig;

// Define list of CSP HTTP Headers
        this.cspHeaders.add("Content-Security-Policy");

// Define CSP policies
// Loading policies for Frame and Sandboxing will be dynamically defined : We need to know if context use Frame
        List<String> cspPolicies = new ArrayList<String>();
        String originLocationRef = "'self'";
        cspPolicies.add("default-src " + "'none'");
        cspPolicies.add("script-src " + originLocationRef);
        cspPolicies.add("style-src " + originLocationRef);
        cspPolicies.add("img-src " + originLocationRef);
        cspPolicies.add("font-src " + originLocationRef);
        cspPolicies.add("connect-src " + originLocationRef);
        cspPolicies.add("frame-ancestors " + originLocationRef);
        cspPolicies.add("base-uri " + originLocationRef);
        cspPolicies.add("form-action " + originLocationRef);
        cspPolicies.add("object-src " + originLocationRef);
        cspPolicies.add("media-src " + originLocationRef);
        cspPolicies.add("frame-src " + originLocationRef);
        cspPolicies.add("upgrade-insecure-requests");

        // Target formating
        this.policies = cspPolicies.toString().replaceAll("(\\[|\\])", "").replaceAll(",", ";")
                .trim();
    }

    /**
     * Add CSP policies on each HTTP response.
     *
     * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest,
     *      javax.servlet.ServletResponse, javax.servlet.FilterChain)
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain fchain)
            throws IOException, ServletException {
        HttpServletResponse httpResponse = ((HttpServletResponse) response);
        StringBuilder policiesBuffer = new StringBuilder(this.policies);
        for (String header : this.cspHeaders) {
            httpResponse.setHeader(header, policiesBuffer.toString());
        }
        fchain.doFilter(request, response);
    }

    /**
     * {@inheritDoc}
     *
     * @see javax.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
        // Not used
    }
}
