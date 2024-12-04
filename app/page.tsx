"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Cookie } from "lucide-react";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const storyTemplates = [
  {
    id: "classic",
    title: "The Classic Gingerbread Man",
    template:
      "Once upon a time, there was a {adjective} old {noun} who loved to bake. One day, they decided to make a gingerbread man. As soon as it was done, the gingerbread man jumped up and {verb} away, shouting \"{exclamation}! You can't catch me, I'm the gingerbread man!\" He ran past a {animal} and a {occupation}, but they couldn't catch him. Finally, he met a clever {creature} who offered to help him cross a {place}. The gingerbread man {adverb} agreed, but as soon as he climbed on the {creature}'s back, he was {verb_past_tense}! And that was the end of the {adjective} gingerbread man.",
  },
  {
    id: "spooky",
    title: "The Spooky Gingerbread House",
    template:
      'On a {adjective} and {weather} night, two {plural_noun} stumbled upon a {size} gingerbread house in the middle of a {place}. The house smelled of {food} and {spice}, but something seemed {adjective2}. As they {verb_past_tense} closer, the door suddenly {verb_past_tense2}! Inside, they found a {creature} stirring a cauldron of {liquid}. "{exclamation}!" they cried, as the creature offered them a {adjective3} cookie. Should they eat it or {verb} away?',
  },
  {
    id: "festive",
    title: "The Gingerbread Family's Holiday Adventure",
    template:
      'It was the night before {holiday}, and the gingerbread family was {verb_ing} with excitement. Papa Gingerbread wore his {adjective} {clothing}, while Mama Gingerbread decorated their house with {plural_noun}. The gingerbread children were {verb_ing2} {adverb}, hoping to catch a glimpse of {character}. Suddenly, they heard a {sound} on the roof! Could it be? They all {verb_past_tense} to the {room} and saw a {color} glow. "{exclamation}!" they all shouted as {character} appeared, carrying a bag full of {plural_object}. It was truly a {adjective2} holiday for the gingerbread family!',
  },
  {
    id: "great-escape",
    title: "The Great Gingerbread Escape",
    template:
      'Once upon a time, there was a/an {adjective} baker who loved making {adjective2} treats. One day, she decided to bake a special gingerbread man using her grandmother\'s {adjective3} recipe. She mixed {number} cups of flour, {number2} teaspoons of {noun}, and a pinch of magical {noun2}. When she opened the {noun3}, the gingerbread man jumped out and {verb_past} across the {noun4}! "Run, run as fast as you can!" he shouted, "You can\'t catch me, I\'m the {adjective4} gingerbread man!" The baker {verb_past2} after him, along with a/an {adjective5} {animal} and a/an {occupation}. They chased him through the {place} and past the {adjective6} {noun5}, but he was too {adjective7} to catch. Finally, they reached a/an {adjective8} river. A clever {animal2} offered to help the gingerbread man {verb} across. Unfortunately for our {adjective9} hero, the {animal2} was feeling rather {emotion}. With one quick {verb2}, the gingerbread man became a/an {adjective10} snack!',
  },
  {
    id: "holiday-disaster",
    title: "Holiday Baking Disaster",
    template:
      "Dear {persons_name}, You won't believe what happened at the {adjective} gingerbread house competition! While I was {verb_ing} my masterpiece, my {relative} accidentally {verb_past} into the table. The roof made of {plural_noun} went flying into the {noun}, and all my {adjective2} decorations {verb_past2} everywhere! To make matters worse, the {adjective3} judge was watching when my entire house {verb_past3} like a/an {noun2}. Everyone in the {place} started {verb_ing2}! At least I won the prize for \"Most {adjective4} Display.\" Next year, I'm sticking to baking {adjective5} cookies instead! {silly_sign_off}, {your_name}",
  },
  {
    id: "recipe-gone-wrong",
    title: "The Gingerbread Recipe Gone Wrong",
    template:
      "BREAKING NEWS from {city_name} Bakery Weekly! Local baker {silly_name} has invented a new gingerbread recipe that makes the cookies {verb}! After adding {number} tablespoons of {silly_word} extract and {adjective} {plural_noun}, the gingerbread people started {verb_ing} around the kitchen and {verb_ing2} on the {plural_noun2}. Health inspectors are {verb_ing3} the situation, but report that the cookies taste {adjective2} with a hint of {noun}. The baker plans to {verb2} more experiments using {adjective3} ingredients from their {relative}'s {place}. Stay tuned for more {adjective4} developments in this story!",
  },
  {
    id: "brave-cookie",
    title: "The Brave Cookie's Interrogation",
    template:
      'In the {adjective} kingdom of {silly_place_name}, Lord {silly_name} was {verb_ing} his breakfast when guards brought in a {adjective2} prisoner - a gingerbread man with {number} gumdrop buttons! "Do you know the {noun}?" Lord {silly_name} {verb_past}, while sitting in his {adjective3} chair. The brave cookie just {verb_past2} and declared, "Not the gumdrop buttons!" Then he {verb_past3} his captors by {verb_ing2} across the {noun2} and {verb_ing3} down a/an {adjective4} hallway. The guards {verb_past4} after him, knocking over {number2} {plural_noun} in the process. But our {adjective5} hero escaped by {verb_ing4} onto a/an {noun3} and shouting, "You\'re all {adjective6} monsters!" To this day, he still runs his {adjective7} cookie shop in {silly_place_name}, selling {plural_noun2} to fellow fairy tale creatures.',
  },
];

export default function GingerbreadMadLibs() {
  const [selectedStory, setSelectedStory] = useState(storyTemplates[0]);
  const [words, setWords] = useState<Record<string, string>>({});
  const [groupedWords, setGroupedWords] = useState<
    { category: string; words: { word: string; index: number }[] }[]
  >([]);
  const [isWordEntry, setIsWordEntry] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const parts = selectedStory.template.split(/(\{[^}]+\})/);
    const wordParts = parts
      .filter((part) => part.startsWith("{") && part.endsWith("}"))
      .map((part, index) => ({
        word: part.slice(1, -1),
        index,
      }));

    const grouped = wordParts.reduce((acc, { word, index }) => {
      const category = word.replace(/[0-9]/g, "").replace(/_/g, " ");
      const existingCategory = acc.find((g) => g.category === category);
      if (existingCategory) {
        existingCategory.words.push({ word, index });
      } else {
        acc.push({ category, words: [{ word, index }] });
      }
      return acc;
    }, [] as { category: string; words: { word: string; index: number }[] }[]);

    // Randomize the order of categories and words within categories
    const randomized = grouped
      .sort(() => Math.random() - 0.5)
      .map((group) => ({
        ...group,
        words: group.words.sort(() => Math.random() - 0.5),
      }));

    setGroupedWords(randomized);
    setWords({});
    setIsWordEntry(true);
  }, [selectedStory]);

  const handleStoryChange = (value: string) => {
    const newStory =
      storyTemplates.find((story) => story.id === value) || storyTemplates[0];
    setSelectedStory(newStory);
  };

  const handleWordChange = (word: string, index: number, value: string) => {
    setWords((prev) => ({ ...prev, [`${word}-${index}`]: value }));
  };

  const generateStory = () => {
    let story = selectedStory.template;
    let wordIndex = 0;
    const sentences = story.split(/(?<=[.!?])\s+/);

    return sentences
      .map((sentence) => {
        return sentence.replace(/\{([^}]+)\}/g, (match, word, offset) => {
          const value = words[`${word}-${wordIndex}`] || "";
          const placeholder = word.replace(/_/g, " ");
          wordIndex++;
          if (offset === 0) {
            return value
              ? capitalizeFirstLetter(value)
              : `<span style="text-decoration: underline; color: #888;">${capitalizeFirstLetter(
                  placeholder
                )}</span>`;
          }
          return value
            ? value.toLowerCase()
            : `<span style="text-decoration: underline; color: #888;">${placeholder}</span>`;
        });
      })
      .join(" ");
  };

  const shareStory = () => {
    const completedStory = generateStory();
    navigator.clipboard.writeText(completedStory).then(
      () => {
        toast({
          title: "Story copied!",
          description:
            "Your gingerbread story has been copied to the clipboard.",
        });
      },
      () => {
        toast({
          title: "Copy failed",
          description: "Unable to copy the story to clipboard.",
          variant: "destructive",
        });
      }
    );
  };

  const toggleMode = () => {
    setIsWordEntry(!isWordEntry);
  };

  const WordEntrySheet = () => (
    <div className="space-y-6">
      {groupedWords.map((group, groupIndex) => (
        <div key={groupIndex}>
          <h4 className="font-bold text-lg mb-2 capitalize">
            {group.category}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {group.words.map(({ word, index }) => (
              <div key={`${word}-${index}`} className="flex flex-col">
                <Label
                  htmlFor={`word-${index}`}
                  className="mb-1 font-bold text-sm uppercase"
                >
                  {word.replace(/_/g, " ").replace(/(\d+)/, " $1")}
                </Label>
                <Input
                  id={`word-${index}`}
                  defaultValue={words[`${word}-${index}`] || ""}
                  onBlur={(e) => handleWordChange(word, index, e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-black mb-8 flex items-center">
        <div className="w-1/4 border-r-2 border-black p-4">
          <div className="flex justify-center">
            <Cookie className="w-16 h-16" />
          </div>
        </div>
        <div className="w-3/4 p-4">
          <h1 className="text-4xl font-bold text-center tracking-wider">
            GINGERBREAD MAD LIBS®
          </h1>
          <h2 className="text-2xl font-bold text-center mt-2 tracking-wide">
            {selectedStory.title.toUpperCase()}
          </h2>
        </div>
      </div>

      {/* Story Selection */}
      <div className="mb-8">
        <Select onValueChange={handleStoryChange}>
          <SelectTrigger className="w-full border-2 border-black">
            <SelectValue placeholder="Select a story" />
          </SelectTrigger>
          <SelectContent>
            {storyTemplates.map((story) => (
              <SelectItem key={story.id} value={story.id}>
                {story.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isWordEntry ? (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Fill in the words:</h3>
          <WordEntrySheet />
        </div>
      ) : (
        <div
          className="font-serif text-lg leading-relaxed space-y-4 mb-8"
          dangerouslySetInnerHTML={{ __html: generateStory() }}
        />
      )}

      <div className="flex justify-between">
        <Button
          onClick={toggleMode}
          className="bg-black text-white hover:bg-gray-800"
        >
          {isWordEntry ? "View Story" : "Edit Words"}
        </Button>
        {!isWordEntry && (
          <Button
            onClick={shareStory}
            className="bg-black text-white hover:bg-gray-800"
          >
            Save and Share Story
          </Button>
        )}
      </div>
    </div>
  );
}
