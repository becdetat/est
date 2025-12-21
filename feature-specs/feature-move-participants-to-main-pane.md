### Move participants to main pane
Currently the participants are listed in a sidebar. I want them to also be shown in the main pane, above "Select Your Estimate".

Participants should be listed using MUI cards, with their estimate selection status shown. If the participant hasn't voted in this round, they should have a blank playing card shown in their MUI card.

When a participant selects a card from their deck it should change the blank playing card shown in their MUI card to a light highlight color.

When the host reveals results the participant's playing cards should rotate along the vertical axis to reveal their selected card to all participants.

Ask me any questions you have in order to implement this feature.

## Layout & Display Questions

1. **Sidebar behavior**: Should the participant sidebar remain (so participants are shown in both places), or should we remove the sidebar and only show participants in the main pane?
The sidebar should remain in the UI for now
    
2. **Participant card layout**: How should the participant cards be arranged in the main pane?
    
    - Grid layout (e.g., 3-4 cards per row)?
    - Horizontal scrolling row?
    - Vertical list?
    - Auto-wrap based on screen size?
Grid layout, 4 cards per row but responsive. Each row should be centre aligned - if there is a row with 2 participant cards, the cards should be centre aligned.

1. **Current user indication**: Should the current user's own card be visually distinguished from other participants (e.g., border color, badge, "You" label)?
    
Yes, give it a border color to distinguish it from other participants

## Card Design Questions

4. **Blank playing card design**: What should the blank card look like before voting?
    
    - Plain gray/white rectangle?
    - Playing card back pattern (e.g., pattern, "Est" logo)?
    - Just an outline?
It should be a simple playing card back pattern, with "Est." in a serif, italic font face in the middle of the card. Keep it subtle.

5. **"Voted but not revealed" state**: When you mention "light highlight color" - should this be:
    
    - A solid color fill (what color - primary blue, green)?
    - A glowing border?
    - The card back with a different color tint?
The "Voted but not revealed" card should have a glowing border.

4. **Revealed card design**: After the flip animation, how should the estimate value be displayed?
    
    - Large centered number/text on the card face?
    - Playing card style with value in corners?
    - Match the deck card styling?
Change the deck card styling to a playing card style, with the value in the corners. The revealed card design should match the deck card styling.
## Animation & Interaction

7. **Flip animation**: Should this be a 3D CSS transform flip (rotateY 180deg), and approximately how long should the animation take (500ms, 1000ms)?
Yes, 3d CSS transform. The animation should take 500 ms.

8. **Consensus indication**: When consensus is reached after reveal, should those matching cards be highlighted differently?
When consensus is reached, 500ms after the card reveal, highlight matching cards in green and shake the cards briefly. 

## Responsive Behavior

9. **Mobile/tablet**: On smaller screens, should the participant cards:
    - Shrink to fit more per row?
    - Show fewer per row with horizontal scroll?
    - Stack vertically?
On smaller viewports stack the cards vertically
