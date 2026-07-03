import { act, renderHook } from "@testing-library/react";
import useDateRangeFromUrl, {
  DEFAULT_END_DATE,
  DEFAULT_START_DATE,
} from "./useDateRangeFromUrl";

function setUrl(search: string) {
  window.history.replaceState({}, "", search || "/");
}

describe("useDateRangeFromUrl", () => {
  beforeEach(() => {
    setUrl("/");
  });

  it("returns defaults when the URL has no date params", () => {
    const { result } = renderHook(() => useDateRangeFromUrl());

    expect(result.current.startDate).toBe(DEFAULT_START_DATE);
    expect(result.current.endDate).toBe(DEFAULT_END_DATE);
    expect(result.current.isInvalidRange).toBe(false);
  });

  it("reads start and end dates from the URL", () => {
    setUrl("/?start=2020-01-05&end=2020-01-06");

    const { result } = renderHook(() => useDateRangeFromUrl());

    expect(result.current.startDate).toBe("2020-01-05");
    expect(result.current.endDate).toBe("2020-01-06");
    expect(result.current.isInvalidRange).toBe(false);
  });

  it("falls back to defaults for invalid date params", () => {
    setUrl("/?start=foo&end=bar");

    const { result } = renderHook(() => useDateRangeFromUrl());

    expect(result.current.startDate).toBe(DEFAULT_START_DATE);
    expect(result.current.endDate).toBe(DEFAULT_END_DATE);
    expect(result.current.isInvalidRange).toBe(false);
  });

  it("updates the URL when setEndDate is called", () => {
    const { result } = renderHook(() => useDateRangeFromUrl());

    act(() => {
      result.current.setEndDate("2020-01-10");
    });

    const params = new URLSearchParams(window.location.search);
    expect(params.get("start")).toBe(DEFAULT_START_DATE);
    expect(params.get("end")).toBe("2020-01-10");
    expect(result.current.endDate).toBe("2020-01-10");
  });

  it("updates the URL when setStartDate is called", () => {
    const { result } = renderHook(() => useDateRangeFromUrl());

    act(() => {
      result.current.setStartDate("2020-01-03");
    });

    const params = new URLSearchParams(window.location.search);
    expect(params.get("start")).toBe("2020-01-03");
    expect(params.get("end")).toBe(DEFAULT_END_DATE);
    expect(result.current.startDate).toBe("2020-01-03");
  });

  it("syncs state when popstate fires", () => {
    setUrl("/?start=2020-01-05&end=2020-01-06");

    const { result } = renderHook(() => useDateRangeFromUrl());

    setUrl("/?start=2020-01-01&end=2020-01-07");

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(result.current.startDate).toBe("2020-01-01");
    expect(result.current.endDate).toBe("2020-01-07");
  });

  it("returns isInvalidRange true when start date is after end date", () => {
    const { result } = renderHook(() => useDateRangeFromUrl());

    act(() => {
      result.current.setStartDate("2020-01-10");
    });

    expect(result.current.isInvalidRange).toBe(true);
  });
});
