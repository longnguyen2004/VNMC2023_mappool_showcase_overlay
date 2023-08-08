export enum GameStates {
    NotRunning = -1,
    MainMenu = 0,
    EditingMap = 1,
    Playing = 2,
    GameShutdownAnimation = 3,
    SongSelectEdit = 4,
    SongSelect = 5,
    WIP_NoIdeaWhatThisIs = 6,
    Watching = 8,
    GameStartupAnimation = 10,
    MultiplayerRooms = 11,
    MultiplayerRoom = 12,
    MultiplayerSongSelect = 13,
    MultiplayerResultsscreen = 14,
    OsuDirect = 15,
    RankingTagCoop = 17,
    RankingTeam = 18,
    ProcessingBeatmaps = 19,
    Tourney = 22,
    ResultsScreen = 32,
    /// <summary>
    /// Indicates that status read in osu memory is not defined in <see cref="OsuMemoryStatus"/>
    /// </summary>
    Unknown = -2
};

export enum GameMode {
    Standard,
    Taiko,
    CatchTheBeat,
    Mania
};

export enum RankStatus {
    Unknown,
    Unsubmitted,
    Unranked,
    Ranked = 4,
    Approved,
    Qualified
}

export type SCObject = Partial<{
    // OsuMemoryEventSource
    acc: number,
    accPpIfMapEndsNow: number,
    aimPpIfMapEndsNow: number,
    banchoCountry: string,
    banchoId: number,
    banchoIsConnected: 0 | 1,
    banchoStatus: number, // TODO: define enums
    banchoUsername: string,
    c100: number,
    c300: number,
    c50: number,
    chatIsEnabled: 0 | 1,
    combo: number,
    comboLeft: number,
    convertedUnstableRate: number,
    currentBpm: number,
    currentMaxCombo: number,
    geki: number,
    grade: number,
    hitErrors: number[],
    ingameInterfaceIsEnabled: 0 | 1,
    isBreakTime: 0 | 1,
    katsu: number,
    liveStarRating: number,
    localTime: string,
    localTimeISO: string,
    mapPosition: string,
    maxGrade: number,
    miss: number,
    noChokePp: number,
    osuIsRunning: 0 | 1,
    playerHp: number,
    playerHpSmooth: number,
    ppIfMapEndsNow: number,
    ppIfRestFced: number,
    score: number,
    simulatedPp: number,
    sliderBreaks: number,
    songSelectionMainPlayerScore: number,
    songSelectionRankingType: number // TODO: define enums
    songSelectionScores: number,
    songSelectionTotalScores: number,
    speedPpIfMapEndsNow: number,
    strainPpIfMapEndsNow: number,
    time: number,
    timeLeft: string,
    unstableRate: number,
    username: string,

    // BackgroundImageProviderPlugin
    backgroundImageLocation: string,
    backgroundImageFileName: string,

    // MapReplacements
    ar: number,
    artistRoman: string,
    artistUnicode: string,
    bpm: string, // bpm as shown in osu!
    circles: number,
    creator: string,
    cs: number,
    diffName: string,
    dir: string,
    dl: string,
    drainingtime: number,
    hp: number,
    lb: "\n" | "\r\n", // line break
    mainBpm: number,
    maxBpm: number,
    minBpm: number,
    md5: string,
    mode: GameMode,
    mp3Name: string,
    od: number,
    osuFileLocation: string,
    osuFileName: string,
    previewTime: number,
    sl: number, // stack leniency
    sliders: number,
    source: string,
    spinners: number,
    starsNomod: number,
    sv: number, // not real SV, this is the SV in timing tab in editor!
    tags: string,
    threadid: number, // maybe forum id?
    titleRoman: string,
    titleUnicode: string,
    totaltime: number

    // ModsHandler
    mAR: number,
    mBpm: string, // bpm as shown in osu!
    mCS: number,
    mHP: number,
    mMainBpm: number,
    mMaxBpm: number,
    mMinBpm: number,
    mOD: number,
    mods: string,
    modsEnum: number, // bitfield of mods
    mStars: number,

    // OsuMemoryEventSource-Regular
    firstHitObjectTime: number,
    mapBreaks: {
        startTime: number,
        endTime: number,
        hasEffect: boolean
    }[],
    mapid: number,
    mapsetid: number,
    mapTimingPoints: {
        startTime: number,
        bpm: number,
        beatLength: number
    }[],
    mapKiaiPoints: {
        startTime: number,
        duration: number
    }[],
    rankedStatus: RankStatus,
    rawStatus: GameStates,
    skin: string,
    skinPath: string,
    status: GameStates,
    totalAudioTime: number,

    // PpReplacements
    gameMode: GameMode,
    mania_1_000_000PP: number,
    mapStrains: [number, number][],
}>