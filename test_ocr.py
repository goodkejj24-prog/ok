import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console logs
    page.on("console", lambda msg: print(f"[CONSOLE {msg.type}] {msg.text}"))

    # Open the HTML file
    page.goto('file:///C:/Users/user/Desktop/여신조건_자동입력기.html')
    page.wait_for_load_state('networkidle')
    print("Step 1: Page loaded")

    # Upload the PDF file
    file_input = page.locator('#srcFile')
    file_input.set_input_files('C:/Users/user/Desktop/여신승인신청서 쌤플/쌤플 여신승인신청서_김쓰리.PDF')
    print("Step 2: PDF file uploaded, waiting for OCR processing...")

    # Wait for OCR - check status text periodically (up to 3 minutes)
    for i in range(36):
        time.sleep(5)
        status_text = page.locator('#pdfStatus').text_content()
        print(f"  [{i*5}s] Status: {status_text}")

        if '완료' in status_text or '오류' in status_text or '직접' in status_text or '실패' in status_text:
            print(f"  Processing finished!")
            break

    # Take final screenshot
    page.screenshot(path='C:/Users/user/Desktop/부동산 시세 임장리스트/test_result.png', full_page=True)

    # Read textarea values
    pre_text = page.locator('#txt_pre').input_value()
    post_text = page.locator('#txt_post').input_value()
    etc_text = page.locator('#txt_etc').input_value()

    print("\n========== RESULTS ==========")
    print(f"[인출 선행조건]\n{pre_text}\n")
    print(f"[인출 후행조건]\n{post_text}\n")
    print(f"[기타]\n{etc_text}\n")

    if pre_text or post_text or etc_text:
        print(">>> SUCCESS: Text was extracted! <<<")
    else:
        print(">>> FAIL: No text was extracted <<<")

    browser.close()
