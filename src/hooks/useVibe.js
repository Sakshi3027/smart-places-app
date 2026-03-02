export async function parseVibe(userInput) {
  const input = userInput.toLowerCase();

  // Type detection
  let type = "restaurant";
  if (input.match(/cafe|coffee|latte|espresso|read|study|work|wifi/)) type = "cafe";
  else if (input.match(/bar|drink|cocktail|beer|pub|nightlife/)) type = "bar";
  else if (input.match(/park|outdoor|nature|chill|fresh air|walk/)) type = "park";
  else if (input.match(/restaurant|eat|food|lunch|dinner|breakfast|bite/)) type = "restaurant";
  else if (input.match(/gym|workout|fitness|exercise/)) type = "gym";
  else if (input.match(/mall|shop|shopping|store/)) type = "shopping_mall";
  else if (input.match(/movie|film|cinema|watch/)) type = "movie_theater";
  else if (input.match(/museum|art|gallery|culture|history/)) type = "museum";
  else if (input.match(/library|quiet|silent|book/)) type = "library";

  // Price detection
  let maxPrice = 3;
  if (input.match(/cheap|budget|affordable|low.cost|inexpensive/)) maxPrice = 1;
  else if (input.match(/fancy|upscale|fine.dining|luxury|expensive/)) maxPrice = 4;
  else if (input.match(/mid|moderate|reasonable/)) maxPrice = 2;

  // Open now detection
  const openNow = !!input.match(/now|open|right now|currently|today/);

  // Keyword
  let keyword = "";
  if (input.match(/romantic|date|cozy/)) keyword = "romantic cozy";
  else if (input.match(/quiet|peaceful|calm/)) keyword = "quiet";
  else if (input.match(/wifi|work|study/)) keyword = "wifi";
  else if (input.match(/quick|fast/)) keyword = "fast";
  else if (input.match(/outdoor|terrace|garden/)) keyword = "outdoor";

  return { type, maxPrice, openNow, keyword };
}