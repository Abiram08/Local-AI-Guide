# Implementation Plan

- [x] 1. Set up project structure and core interfaces
  - Create directory structure for agents, types, utils, and client components
  - Define TypeScript interfaces for all agent inputs/outputs and system types
  - Set up testing framework with Jest and fast-check for property-based testing
  - Configure build system with TypeScript compilation and development scripts
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_

- [x] 1.1 Create core TypeScript type definitions
  - Write comprehensive interfaces for TouristPersona, GuideMatch, CrowdPrediction, PriceAnalysis, SafetyResponse, and Itinerary
  - Define UserInput and OrchestratorResponse interfaces for main API
  - Create venue, guide, and activity data structures
  - _Requirements: 1.5, 2.5, 3.1, 4.3, 5.4, 6.5_

- [x]* 1.2 Write property test for type structure validation
  - **Property 4: Persona structure completeness**
  - **Validates: Requirements 1.4, 1.5**

- [x] 1.3 Set up AI client utility with Groq integration
  - Implement callAI function with error handling and retry logic
  - Create parseAIResponse utility for JSON parsing with fallback handling
  - Configure Groq client with proper API key management
  - _Requirements: 9.1, 9.5_

- [x]* 1.4 Write property test for AI client error handling
  - **Property 29: Fallback mechanism activation**
  - **Validates: Requirements 9.1**

- [x] 2. Implement Tourist Profiler (Agent 1)
  - Create profileTourist function that analyzes app interactions
  - Implement interest scoring algorithm for 5 categories (adventure, food, culture, nightlife, relaxation)
  - Build persona classification logic with confidence calculation
  - Add fallback mechanism using heuristic analysis when AI service fails
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2.1 Build behavioral analysis algorithm
  - Implement click pattern analysis and search query processing
  - Create time-spent weighting system for interest calculation
  - Build confidence scoring based on data completeness
  - _Requirements: 1.1, 1.2_

- [x]* 2.2 Write property test for persona confidence threshold
  - **Property 1: Persona confidence threshold**
  - **Validates: Requirements 1.1**

- [x]* 2.3 Write property test for complete interest scoring
  - **Property 2: Complete interest scoring**
  - **Validates: Requirements 1.2**

- [x] 2.4 Implement fallback persona generation
  - Create heuristic-based persona generation for insufficient data
  - Build default interest categorization system
  - Implement budget estimation from filter data
  - _Requirements: 1.3, 1.4_

- [x]* 2.5 Write property test for fallback persona generation
  - **Property 3: Fallback persona generation**
  - **Validates: Requirements 1.3**

- [x] 3. Implement Guide Matcher (Agent 2)
  - Create matchGuide function with ML scoring algorithm (40-point system)
  - Implement scoring components: language match (10pts), specialty alignment (10pts), rating (10pts), availability (5pts), personality fit (5pts)
  - Build guide ranking system returning top 3 matches with detailed reasons
  - Add fallback mechanism with hardcoded top-rated guides
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3.1 Build ML scoring algorithm
  - Implement 40-point scoring system with component validation
  - Create language matching logic with multi-language support
  - Build specialty alignment scoring based on interest overlap
  - _Requirements: 2.1, 2.2_

- [x]* 3.2 Write property test for guide scoring bounds
  - **Property 5: Guide scoring bounds**
  - **Validates: Requirements 2.1**

- [x]* 3.3 Write property test for scoring component validation
  - **Property 6: Scoring component validation**
  - **Validates: Requirements 2.2**

- [x] 3.4 Implement guide ranking and selection
  - Create top-3 guide selection with score-based ranking
  - Build match reason generation explaining selection criteria
  - Implement guide information completeness validation
  - _Requirements: 2.3, 2.5_

- [x]* 3.5 Write property test for top guide ranking
  - **Property 7: Top guide ranking**
  - **Validates: Requirements 2.3**

- [x]* 3.6 Write property test for guide information completeness
  - **Property 8: Guide information completeness**
  - **Validates: Requirements 2.5**

- [x] 4. Implement Crowd Manager (Agent 3)
  - Create manageCrowds function with ML-based crowd prediction
  - Implement current and 30-minute future crowd level predictions using historical data
  - Build crowd threshold classification (1000+ people = CROWDED/VERY_CROWDED)
  - Create alternative venue suggestion system with ranking algorithm
  - Add fallback mechanism using time-based estimation
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4.1 Build crowd prediction algorithm
  - Implement historical data analysis with weather impact factors
  - Create ML model simulation with 85%+ confidence predictions
  - Build time-based multipliers for day/hour variations
  - _Requirements: 3.1, 3.5_

- [x]* 4.2 Write property test for crowd prediction generation
  - **Property 9: Crowd prediction generation**
  - **Validates: Requirements 3.1**

- [x]* 4.3 Write property test for prediction confidence threshold
  - **Property 12: Prediction confidence threshold**
  - **Validates: Requirements 3.5**

- [x] 4.4 Implement crowd threshold classification
  - Create status classification logic (LOW/MODERATE/CROWDED/VERY_CROWDED)
  - Build threshold-based decision system with 1000-person limit
  - _Requirements: 3.2_

- [x]* 4.5 Write property test for crowd threshold classification
  - **Property 10: Crowd threshold classification**
  - **Validates: Requirements 3.2**

- [x] 4.6 Build alternative venue suggestion system
  - Create alternative ranking algorithm considering crowd, rating, and travel time
  - Implement venue similarity matching for appropriate alternatives
  - _Requirements: 3.3, 3.4_

- [x]* 4.7 Write property test for alternative venue suggestions
  - **Property 11: Alternative venue suggestions**
  - **Validates: Requirements 3.3**

- [x] 5. Implement Price Intelligence (Agent 4)
  - Create analyzePrices function with fair pricing calculation
  - Implement cost breakdown algorithm: ingredients + labor + location premium + utilities + 30% markup
  - Build exploitation detection system flagging prices >50% above fair price
  - Create GoanFlow pricing with 15% discount due to guaranteed bookings
  - Add fallback mechanism using predefined cost structures
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5.1 Build fair pricing calculation algorithm
  - Implement ingredient cost calculation from knowledge base
  - Create location premium factors (beach +25%, commercial -10%, residential +5%)
  - Build labor and utilities cost allocation system
  - _Requirements: 4.1, 4.3_

- [x]* 5.2 Write property test for fair price calculation
  - **Property 13: Fair price calculation**
  - **Validates: Requirements 4.1**

- [x]* 5.3 Write property test for cost breakdown completeness
  - **Property 15: Cost breakdown completeness**
  - **Validates: Requirements 4.3**

- [x] 5.4 Implement exploitation detection system
  - Create price comparison logic with 50% threshold
  - Build market price analysis with typical charge tracking
  - Implement exploitation flagging and warning system
  - _Requirements: 4.2, 4.4_

- [x]* 5.5 Write property test for exploitation detection threshold
  - **Property 14: Exploitation detection threshold**
  - **Validates: Requirements 4.2, 4.4**

- [x] 5.6 Create GoanFlow pricing system
  - Implement 15% discount calculation for negotiated prices
  - Build price recommendation system with fair price validation
  - _Requirements: 4.5_

- [x]* 5.7 Write property test for GoanFlow pricing discount
  - **Property 16: GoanFlow pricing discount**
  - **Validates: Requirements 4.5**

- [x] 6. Implement Safety Guardian (Agent 6)
  - Create checkSafety function with risk assessment on 1-10 scale
  - Implement alert generation system with type categorization (WEATHER, CRIME, HEALTH, WOMEN_SAFETY, TRAFFIC, EVENT)
  - Build severity classification (HIGH, MEDIUM, INFO) with appropriate actions
  - Create emergency contact provision system with location-specific contacts
  - Add enhanced safety guidance for solo female travelers after 10 PM
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 6.1 Build risk assessment algorithm
  - Implement 1-10 risk level calculation considering time, location, and profile
  - Create location/time risk matrices for different areas
  - Build tourist profile risk factor analysis
  - _Requirements: 5.1_

- [x]* 6.2 Write property test for risk level bounds
  - **Property 17: Risk level bounds**
  - **Validates: Requirements 5.1**

- [x] 6.3 Implement alert generation and categorization
  - Create alert type classification system with 6 categories
  - Build severity assessment logic (HIGH/MEDIUM/INFO)
  - Implement action recommendation system for each alert type
  - _Requirements: 5.2, 5.3_

- [x]* 6.4 Write property test for alert categorization
  - **Property 18: Alert categorization**
  - **Validates: Requirements 5.2**

- [x] 6.5 Build emergency contact system
  - Create location-specific emergency contact database
  - Implement contact provision for police, ambulance, and tourist helpline
  - Build nearby hospital and guide contact integration
  - _Requirements: 5.4_

- [x]* 6.6 Write property test for emergency contact provision
  - **Property 19: Emergency contact provision**
  - **Validates: Requirements 5.4**

- [x] 6.7 Implement enhanced safety for solo female travelers
  - Create solo female detection logic with time-based triggers
  - Build women-specific safety tip generation
  - Implement enhanced guidance system for vulnerable situations
  - _Requirements: 5.5_

- [x]* 6.8 Write property test for solo female safety enhancement
  - **Property 20: Solo female safety enhancement**
  - **Validates: Requirements 5.5**

- [x] 7. Implement Experience Curator (Agent 5) - Main Orchestrator
  - Create curateExperience function coordinating all 5 agents
  - Implement budget constraint satisfaction ensuring costs don't exceed limits
  - Build scheduling system avoiding peak crowds with 15-minute travel buffers
  - Create safety-first decision making modifying itineraries based on alerts
  - Generate hour-by-hour schedules with complete activity information
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7.1 Build agent orchestration system
  - Create coordination logic calling all 5 agents in proper sequence
  - Implement data integration system combining agent outputs
  - Build constraint satisfaction algorithm balancing all requirements
  - _Requirements: 6.1_

- [x]* 7.2 Write property test for agent orchestration completeness
  - **Property 21: Agent orchestration completeness**
  - **Validates: Requirements 6.1**

- [x] 7.3 Implement budget constraint system
  - Create budget tracking and validation throughout itinerary generation
  - Build cost optimization system staying within specified limits
  - Implement budget allocation across activities and guide time
  - _Requirements: 6.2_

- [x]* 7.4 Write property test for budget constraint satisfaction
  - **Property 22: Budget constraint satisfaction**
  - **Validates: Requirements 6.2**

- [x] 7.5 Build scheduling constraint system
  - Implement crowd avoidance logic using crowd predictions
  - Create travel time buffer system with 15-minute minimums
  - Build activity timing optimization avoiding peak periods
  - _Requirements: 6.3_

- [x]* 7.6 Write property test for scheduling constraint compliance
  - **Property 23: Scheduling constraint compliance**
  - **Validates: Requirements 6.3**

- [x] 7.7 Create comprehensive itinerary generation
  - Build hour-by-hour schedule generation with complete activity details
  - Implement activity information completeness validation
  - Create explanation system for each recommendation
  - _Requirements: 6.5_

- [x]* 7.8 Write property test for itinerary information completeness
  - **Property 24: Itinerary information completeness**
  - **Validates: Requirements 6.5**

- [x] 8. Implement main orchestrator and API endpoints
  - Create orchestrateGoanFlow function as main entry point
  - Build Express.js API server with individual agent endpoints
  - Implement health check endpoint with system status reporting
  - Create comprehensive error handling with appropriate HTTP status codes
  - Add CORS support and JSON formatting for frontend integration
  - _Requirements: 8.2, 8.3, 8.4, 8.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 8.1 Build main orchestration function
  - Create orchestrateGoanFlow as central coordination point
  - Implement user input processing through all 6 agents
  - Build complete response generation with all required components
  - _Requirements: 8.2, 8.3_

- [x]* 8.2 Write property test for agent processing coordination
  - **Property 26: Agent processing coordination**
  - **Validates: Requirements 8.2**

- [x]* 8.3 Write property test for response completeness
  - **Property 27: Response completeness**
  - **Validates: Requirements 8.3**

- [x] 8.4 Create Express.js API server
  - Implement individual endpoints for each of the 6 agents
  - Build main orchestration endpoint with request validation
  - Create health check endpoint with status, timestamp, and version
  - _Requirements: 10.1, 10.2_

- [x]* 8.5 Write property test for endpoint availability
  - **Property 31: Endpoint availability**
  - **Validates: Requirements 10.1**

- [x]* 8.6 Write property test for health check completeness
  - **Property 32: Health check completeness**
  - **Validates: Requirements 10.2**

- [x] 8.7 Implement comprehensive error handling
  - Create error response formatting with descriptive messages
  - Build HTTP status code system for different error types
  - Implement CORS headers and JSON formatting validation
  - _Requirements: 10.4, 10.5_

- [x]* 8.8 Write property test for error response formatting
  - **Property 33: Error response formatting**
  - **Validates: Requirements 10.4**

- [x]* 8.9 Write property test for response formatting compliance
  - **Property 34: Response formatting compliance**
  - **Validates: Requirements 10.5**

- [x] 9. Implement knowledge base integration
  - Create product.md knowledge base access system
  - Implement venue information querying for 500+ venues
  - Build guide network data access for 200+ guides
  - Create pricing algorithm data integration
  - Implement safety intelligence data utilization
  - Add cultural context information provision
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 9.1 Build knowledge base access system
  - Create product.md file reading and parsing utilities
  - Implement data extraction for all 7 domains (venues, guides, crowds, pricing, safety, culture, routing)
  - Build query system for agent-specific data needs
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x]* 9.2 Write property test for knowledge base data access
  - **Property 25: Knowledge base data access**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

- [x] 10. Build React frontend application
  - Create user interface with input forms for date, budget, and interest sliders
  - Implement itinerary display with persona, guide details, safety alerts, and activity schedule
  - Build activity information display showing time, location, cost, crowd status, safety rating, and explanations
  - Create new itinerary generation options for parameter modification
  - _Requirements: 8.1, 8.3, 8.4, 8.5_

- [x] 10.1 Create user input interface
  - Build interactive forms with date picker, budget slider, and interest level controls
  - Implement real-time validation and user feedback
  - Create responsive design for various screen sizes
  - _Requirements: 8.1_

- [x] 10.2 Build itinerary display system
  - Create comprehensive display for tourist persona with confidence and interests
  - Implement matched guide information with score and match reasons
  - Build safety alert display with severity-based styling
  - Create detailed activity schedule with all required information
  - _Requirements: 8.3, 8.4_

- [x]* 10.3 Write property test for activity information completeness
  - **Property 28: Activity information completeness**
  - **Validates: Requirements 8.4**

- [x] 10.4 Implement itinerary modification system
  - Create new itinerary generation with different parameters
  - Build parameter modification interface
  - Implement state management for multiple itinerary requests
  - _Requirements: 8.5_

- [x] 11. Implement comprehensive error handling and fallbacks
  - Create fallback mechanisms for each agent when AI services fail
  - Implement system continuity ensuring user experience during failures
  - Build error logging system with appropriate context
  - Create graceful degradation with service level indicators
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 11.1 Build agent-specific fallback systems
  - Create Tourist Profiler fallback using heuristic analysis
  - Implement Guide Matcher fallback with hardcoded top guides
  - Build Crowd Manager fallback using time-based estimation
  - Create Price Intelligence fallback with predefined cost structures
  - Implement Safety Guardian fallback with location/time matrices
  - _Requirements: 9.2, 9.3, 9.4_

- [x]* 11.2 Write property test for system continuity under failure
  - **Property 30: System continuity under failure**
  - **Validates: Requirements 9.5**

- [x] 12. Final integration and testing
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12.1 Run comprehensive test suite
  - Execute all unit tests with 90%+ coverage verification
  - Run all property-based tests with 100+ iterations each
  - Validate integration between all agents and orchestrator
  - Test error handling and fallback mechanisms

- [x] 12.2 Validate end-to-end functionality
  - Test complete user journeys from input to itinerary generation
  - Verify all agent coordination and data flow
  - Validate frontend-backend integration
  - Test performance benchmarks (<2s response time)

- [x] 12.3 Verify property-based test compliance
  - Confirm all 34 correctness properties are implemented and passing
  - Validate property test tagging with correct format
  - Ensure minimum 100 iterations per property test
  - Verify all requirements are covered by corresponding properties