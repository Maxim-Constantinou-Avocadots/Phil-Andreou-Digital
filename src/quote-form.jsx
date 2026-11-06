import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import { tr, isGreek, localPath, translatedField, errorText } from "./i18n.js";
import { createFormStore, focusControl, FORM_ERROR, otherText, otherValue } from "/js/wix/form-store.js";
import { QUOTE_FORM_ID } from "./connection.js";

const store = createFormStore({ formId: QUOTE_FORM_ID });
let root;
let request = 0;

function Arrow() {
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>;
}

function Field({ field, form, state }) {
  field = translatedField(field);
  const value = state.values[field.target];
  const error = errorText(state.errors[field.target]);
  const id = `field-${field.target}`;
  const change = (next) => store.setValue(field.target, next);
  const mark = field.required && form.requiredIndicator !== "NONE"
    ? <span className="required-mark">{form.requiredIndicator === "TEXT" ? tr(" (Required)") : " *"}</span> : null;
  const title = <>{form.requiredIndicatorBefore && mark}{field.label}{!form.requiredIndicatorBefore && mark}</>;
  const props = {
    id, name: field.target, required: field.required, disabled: field.readOnly || state.loading,
    "aria-label": !field.showLabel ? field.label : undefined,
    "aria-invalid": !!error,
    "aria-describedby": `${field.description ? `help-${field.target} ` : ""}err-${field.target}`,
    onBlur: () => store.validate(field.target)
  };
  let control;
  const options = field.choices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>);
  if (field.control === "textarea") {
    control = <textarea {...props} rows="4" value={String(value ?? "")} placeholder={field.placeholder} maxLength={field.validation.maxLength} onChange={(event) => change(event.target.value)} />;
  } else if (field.control === "select") {
    const isOther = field.otherOption && !!value && !field.choices.some((choice) => choice.value === value);
    control = <><select {...props} value={isOther ? "__other" : String(value ?? "")} onChange={(event) => change(event.target.value === "__other" ? otherValue(field, "") : event.target.value)}><option value="">{field.placeholder || tr("Choose an option")}</option>{options}{field.otherOption && <option value="__other">{field.otherOption.label}</option>}</select>{isOther && <input aria-label={field.otherOption.label} value={otherText(field, value)} placeholder={field.otherOption.placeholder} onChange={(event) => change(otherValue(field, event.target.value))} />}</>;
  } else if (["radio", "checkboxGroup", "tags"].includes(field.control)) {
    control = <div className="choice-group">{field.choices.map((choice) => {
      const radio = field.control === "radio";
      const selected = radio ? value === choice.value : (Array.isArray(value) ? value : []).includes(choice.value);
      return <label key={choice.value}><input {...props} id={`${id}-${choice.value}`} type={radio ? "radio" : "checkbox"} value={choice.value} checked={selected} onChange={(event) => change(radio ? choice.value : event.target.checked ? [...(Array.isArray(value) ? value : []), choice.value] : value.filter((item) => item !== choice.value))} />{choice.label}</label>;
    })}</div>;
  } else if (field.control === "checkbox") {
    control = <label className="checkbox-label"><input {...props} type="checkbox" checked={value === true} onChange={(event) => change(event.target.checked)} />{title}</label>;
  } else if (field.control === "file") {
    control = <><input {...props} type="file" accept={field.validation.accept} multiple={(field.validation.fileLimit || 1) > 1} onChange={(event) => change([...event.target.files])} /><span className="field-help">{field.explanationText || field.buttonText}</span></>;
  } else if (field.control === "address") {
    control = <div className="address-fields">{field.addressParts.map((part) => {
      const key = `${field.target}/${part.sub}`;
      const address = value || {};
      const addressProps = {
        name: key, required: part.required, disabled: props.disabled, value: address[part.sub] || "",
        "aria-invalid": !!state.errors[key], "aria-describedby": `err-${key}`,
        onChange: (event) => change({ ...address, [part.sub]: event.target.value }),
        onBlur: () => store.validate(key)
      };
      return <label key={part.sub}>{part.label}{part.choices?.length ? <select {...addressProps}><option value="">Choose {part.label.toLowerCase()}</option>{part.choices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}</select> : <input {...addressProps} />}<span id={`err-${key}`} className="field-error">{errorText(state.errors[key])}</span></label>;
    })}</div>;
  } else if (["payment", "appointment", "signature", "unknown"].includes(field.control)) {
    control = <p className="field-help">{tr("This field needs assistance from our team. Please contact us to complete your enquiry.")}</p>;
  } else {
    const type = { phone: "tel", datetime: "datetime-local", rating: "number" }[field.control] || field.control;
    const autocomplete = { CONTACTS_EMAIL: "email", CONTACTS_PHONE: "tel", CONTACTS_FIRST_NAME: "given-name", CONTACTS_LAST_NAME: "family-name", CONTACTS_COMPANY: "organization" }[field.identifier];
    control = <input {...props} type={type} autoComplete={autocomplete} value={String(value ?? "")} placeholder={field.placeholder} maxLength={field.validation.maxLength} min={field.validation.minDate ?? field.validation.minimum} max={field.validation.maxDate ?? field.validation.maximum} step={field.validation.multipleOf} onChange={(event) => change(event.target.value)} />;
  }
  return <div className={`form-field ${["textarea", "address", "checkboxGroup", "checkbox"].includes(field.control) ? "field-wide" : ""}`}>
    {field.showLabel && field.control !== "checkbox" && <label htmlFor={id}>{title}</label>}
    {control}
    {field.description && <p className="field-help" id={`help-${field.target}`}>{field.description}</p>}
    <p className="field-error" id={`err-${field.target}`} aria-live="polite">{error}</p>
  </div>;
}

function reviewValue(field, value) {
  if (field.control === "checkbox") return value ? tr("Yes") : tr("No");
  if (field.control === "file") return (value || []).map((file) => file.name || file.displayName).join(", ");
  if (field.control === "address") return Object.values(value || {}).filter(Boolean).join(", ");
  const display = (item) => field.choices.find((choice) => choice.value === item) ? tr(field.choices.find((choice) => choice.value === item).label) : item;
  return Array.isArray(value) ? value.map(display).join(", ") : String(display(value) ?? "");
}

function QuoteApp({ service, requestId, embedded = false, shouldFocus = true }) {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  const { form, errors, loading, closed, outcome } = state;
  const [reviewing, setReviewing] = useState(false);
  const [retry, setRetry] = useState(0);
  const appliedRequest = useRef(0);
  const formRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => { store.start(); }, [retry]);
  useEffect(() => {
    if (!form || appliedRequest.current === requestId) return;
    appliedRequest.current = requestId;
    if (outcome) store.reset();
    if (service) {
      const field = form.fields.find((item) => item.choices.some((choice) => choice.value === service || choice.label === service));
      const choice = field?.choices.find((item) => item.value === service || item.label === service);
      if (field && choice) store.setValue(field.target, choice.value);
    }
    setReviewing(false);
    if (shouldFocus && (embedded || document.querySelector("#quote-dialog")?.open)) {
      formRef.current?.querySelector("input,select,textarea")?.focus({ preventScroll: true });
    }
  }, [form, service, requestId, outcome, embedded, shouldFocus]);
  useEffect(() => {
    document.querySelector("#quote-dialog")?.setAttribute("aria-labelledby", reviewing && !outcome ? "quote-review-title" : "quote-title");
    if (reviewing || outcome) {
      headingRef.current?.focus({ preventScroll: true });
      if (embedded) headingRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }
  }, [reviewing, outcome, embedded]);
  useEffect(() => {
    if (!outcome?.url) return;
    if (outcome.newTab) window.open(outcome.url, "_blank", "noopener,noreferrer");
    else window.location.assign(outcome.url);
  }, [outcome]);

  const close = () => {
    if (embedded) window.location.assign(localPath("/"));
    else document.querySelector("#quote-dialog")?.close();
  };
  const reset = () => { store.reset(); setReviewing(false); };
  if (outcome) return <div className="quote-success" role="status"><h2 id="quote-title" tabIndex="-1" ref={headingRef}>{tr("Enquiry")}<br />{tr("received.")}</h2><div className="dialog-intro">{tr(outcome.message || "Thank you for your enquiry. Our team will be in touch.").split("\n").filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}</div><div className="review-actions"><button className="button primary" onClick={close}>{tr("Back to the website")} <Arrow /></button><button className="button secondary" onClick={reset}>{tr("Start another enquiry")}</button></div></div>;
  if (!form) return <><h2 id="quote-title">{tr("Let’s make")}<br />{tr("something real.")}</h2>{loading ? <p className="dialog-intro" role="status" aria-live="polite">{tr("Loading your enquiry form…")}</p> : <div className="form-load-error" role="alert"><p>{tr("The enquiry form couldn’t be loaded. Please try again.")}</p><button className="button secondary" onClick={() => { store.stop(); setRetry((number) => number + 1); }}>{tr("Try again")} <Arrow /></button><p>{tr("You can also reach our team on")} <a href="tel:+35725865270">+357 25 865270</a>.</p></div>}</>;
  if (closed) return <><h2 id="quote-title">{tr("Let’s talk.")}</h2><p className="dialog-intro">{tr(form.disabledMessage) || tr("This form is currently closed. Please call our team on +357 25 865270 to discuss your project.")}</p></>;
  const fields = form.fields.filter((field) => field.stepId === form.steps[state.step]?.id);
  const last = state.step === form.steps.length - 1;
  const unsupported = form.fields.some((field) => ["payment", "appointment", "signature", "unknown"].includes(field.control));
  const review = (event) => {
    event.preventDefault();
    if (!last) { store.next(event); return; }
    if (!store.validate()) {
      focusControl(formRef.current, Object.keys(store.getState().errors).find((key) => key !== FORM_ERROR));
      return;
    }
    setReviewing(true);
    const dialog = document.querySelector("#quote-dialog");
    if (dialog) dialog.scrollTop = 0;
  };
  const send = async () => {
    const result = await store.submit({ currentTarget: formRef.current, preventDefault() {} });
    if (!result) {
      setReviewing(false);
      requestAnimationFrame(() => focusControl(formRef.current, Object.keys(store.getState().errors).find((key) => key !== FORM_ERROR)));
    }
  };
  return <form id="quote-form" ref={formRef} noValidate onSubmit={review} aria-busy={loading}>
    <div hidden={reviewing}>
      <h2 id="quote-title" tabIndex="-1" ref={!reviewing ? headingRef : null}>{embedded ? <>{tr("Tell us about")}<br />{tr("your idea.")}</> : <>{tr("Let’s make")}<br />{tr("something real.")}</>}</h2>
      <p className="dialog-intro">{tr("A few details are all we need to start the conversation.")}</p>
      {form.steps.length > 1 && <p className="form-step">{isGreek ? "Βήμα" : "Step"} {state.step + 1} {isGreek ? "από" : "of"} {form.steps.length}{form.steps[state.step]?.name && ` · ${form.steps[state.step].name}`}</p>}
      <div className="form-grid">{form.fields.map((field) => <div key={field.target} hidden={!fields.includes(field)} className={["textarea", "address", "checkboxGroup", "checkbox"].includes(field.control) ? "field-wide" : ""}><Field field={field} form={form} state={state} /></div>)}</div>
      {errors[FORM_ERROR] && <p className="field-error form-error" role="alert">{errorText(errors[FORM_ERROR])}</p>}
      <p className="form-note" id="quote-note">{tr("Review your details before sending your enquiry directly to our team.")}</p>
      <p className="form-privacy">{tr("We use your details to respond to your enquiry.")} <a href={localPath("/privacy.html")} target="_blank" rel="noopener noreferrer" aria-label={tr("Read our Privacy policy (opens in a new tab)")}>{tr("Read our Privacy policy")}</a>.</p>
      <div className="review-actions">{state.step > 0 && <button className="button secondary" type="button" onClick={store.previous}>{tr(form.previousText) || tr("Back")}</button>}<button className="button primary form-submit" type="submit" disabled={loading || unsupported} aria-describedby="quote-note">{last ? tr("Review enquiry") : tr(form.nextText) || tr("Continue")}<Arrow /></button></div>
    </div>
    <div hidden={!reviewing} className="quote-review">
      <h2 id="quote-review-title" tabIndex="-1" ref={reviewing ? headingRef : null}>{tr("Your idea.")}<br />{tr("Ready to share.")}</h2>
      <p className="dialog-intro">{tr("Check your details, then send your enquiry to Phil Andreou Digital.")}</p>
      <dl className="enquiry-summary">{form.fields.map((field) => <div key={field.target}><dt>{tr(field.label)}</dt><dd>{reviewValue(field, state.values[field.target]) || tr("Not provided")}</dd></div>)}</dl>
      <div className="review-actions"><button className="button primary" type="button" disabled={loading} onClick={send}>{loading ? tr("Sending enquiry…") : tr(form.submitText) || tr("Send enquiry")}<Arrow /></button><button className="button secondary" type="button" disabled={loading} onClick={() => setReviewing(false)}>{tr("Edit details")}</button></div>
      <p className="form-note">{tr("Your enquiry is sent when you press “")}{tr(form.submitText) || tr("Send enquiry")}{tr("”.")}</p>
    </div>
  </form>;
}

export function openQuote(service = "", { embedded = false, shouldFocus = true } = {}) {
  const container = document.querySelector("#quote-app");
  root ||= createRoot(container);
  root.render(<QuoteApp service={service} requestId={++request} embedded={embedded} shouldFocus={shouldFocus} />);
}
