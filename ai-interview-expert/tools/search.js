import { TavilySearch } from "@langchain/tavily";
 
const searchTool = new TavilySearch({
  maxResults: 2,
  searchDepth:"basic"
});

export default searchTool